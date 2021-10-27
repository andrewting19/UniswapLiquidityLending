import { Injectable } from '@angular/core';
import Web3 from "web3";
import { ERC20Token, RentInfo, Position } from 'src/app/models/interfaces';
import { ERC20ABI, myABI, poolABI, NFTMinterABI } from 'src/app/models/abi';
import { async } from '@angular/core/testing';

declare const window: any;

const address = "0xC1a7CFb1e1D5eBD1881ef18Dc7a01cfD638DbD7e"; //Address of our custom smart contract
const NFTMinterAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; //Hard coded address of Uniswap NFT Minter contract

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  window: any;
  managerContract: any = null;
  NFTMinterContract: any = null;
  account: any = null;

  constructor() {
    let setup = async () => {
      this.account = await this.openMetamask();

    }
    setup();
  }
  private getAccounts = async () => {
      try {
          return await window.ethereum.request({ method: 'eth_accounts' });
      } catch (e) {
        console.log("ERROR :: getAccounts ::", e)
        return [];
      }
  }

  public openMetamask = async () => {
      window.web3 = new Web3(window.ethereum);
      let addresses = await this.getAccounts();
      if (!addresses.length) {
          try {
            addresses = await window.ethereum.enable();
          } catch (e) {
            console.log("ERROR :: openMetamask ::", e)
            return false;
          }
      }
      this.getManagerContract();
      return addresses.length ? addresses[0] : null;
  };

  public getManagerContract = async () => {
    if (!this.account) {
      this.account = await this.openMetamask();
    }
    if (!this.managerContract) {
      this.managerContract = new window.web3.eth.Contract(
        myABI,
        address,
      );
    }
  }

  public getNFTMinterContract = async () => {
    this.NFTMinterContract = new window.web3.eth.Contract(NFTMinterABI, NFTMinterAddress)
  }

  public isOwner = async () => {
    await this.getManagerContract();
    let owner = await this.managerContract.methods._owner().call();
    return owner.toLowerCase() == this.account.toLowerCase();
  }

  public getERC20TokenInfoFromAddress = async (tokenAddress: string) => {
    const tokenContract = new window.web3.eth.Contract(ERC20ABI, tokenAddress);
    const symbol = await tokenContract.methods.symbol().call();
    // const decimals = await tokenContract.methods.decimals().call();
    const name = await tokenContract.methods.name().call();
    return { address: tokenAddress, symbol: symbol, name: name } as ERC20Token; 
  }

  public getPairing = async (tokenId: number) => {
    await this.getManagerContract();
    try {
      const tokens = await this.managerContract.methods.itemIdToTokenAddrs(tokenId).call();
      const tokenInfo: ERC20Token[] = [await this.getERC20TokenInfoFromAddress(tokens.token0Addr), await this.getERC20TokenInfoFromAddress(tokens.token1Addr)]
      return tokenInfo;
    } catch (e) {
      console.log("ERROR :: getPairing ::", e);
      return []
    }
  }

  public getPosition = async (tokenId: number) => {
    await this.getNFTMinterContract();
    try {
      const position = await this.NFTMinterContract.methods.positions(tokenId).call();
      return {
        tickUpper: position.tickUpper,
        tickLower: position.tickLower,
        liquidity: position.liquidity,
        fee: position.fee,
        feeGrowth: [position.feeGrowthInside0LastX128, position.feeGrowthInside1LastX128],
        tokensOwed: [position.tokensOwed0, position.tokensOwed1]
      } as Position
    } catch (e) {
      console.log("ERROR :: getPosition ::", e);
      return {} as Position
    }
  }

  public approveTransfer = async (tokenId: number) => {
    await this.getManagerContract();
    await this.getNFTMinterContract();
    try {
      await this.NFTMinterContract.methods.approve(address, tokenId).send({from: this.account});
      return true
    } catch (e) {
      console.log("ERROR :: approveTransfer ::", e);
      return false
    }
  }

  public createNewRental = async (tokenId: number, priceInEther: number, durationInSeconds: number) => {
    await this.getManagerContract();
    try {
      await this.approveTransfer(tokenId);
      await this.managerContract.methods.putUpNFTForRent(
        tokenId, 
        window.web3.utils.toWei(priceInEther.toString(), 'ether'),
        durationInSeconds,
      ).send({from: this.account});
      return true;
    } catch (e) {
      console.log("ERROR :: createNewRental ::", e);
      return false;
    }
  }

  public deleteRental = async (tokenId: number) => {
    await this.getManagerContract();
    try {
      await this.managerContract.methods.removeNFTForRent(
        tokenId
      ).send({ from: this.account });
      return true;
    } catch (e) {
      console.log("ERROR :: deleteRental ::", e);
      return false;
    }
  }

  public rent = async (tokenId: number, priceInEther: number) => {
    await this.getManagerContract();
    try {
      await this.managerContract.methods.rentNFT(
        tokenId
      ).send({
        from: this.account,
        value: window.web3.utils.toWei(priceInEther.toString(), 'ether')
      });
      return true;
    } catch (e) {
      console.log("ERROR :: rent ::", e);
      return false;
    }
  }

  //Protoco fee is the fee in percentages
  public calculateProtocolFees(tokenId: number, protocolFee: number) {
    const rentPrice = this.managerContract.methods.itemIdToRentInfo(tokenId).price;
    return protocolFee * rentPrice;

  }

  public withdrawCash = async (tokenId: number) => {
    await this.getManagerContract();
    try {
      await this.managerContract.methods.withdrawFees(
        tokenId
      ).send({ from: this.account});
      return true;
    } catch (e) {
      console.log("ERROR :: withdrawCash ::", e);
      return false;
    }
  }

  public returnRentalToOwner = async (tokenId: number) => {
    await this.getManagerContract();
    try {
      await this.managerContract.methods.returnNFTToOwner(
        tokenId
      ).send({ from: this.account});
      return true;
    } catch (e) {
      console.log("ERROR :: returnRentalToOwner ::", e);
      return false;
    }
  }

  public getAllListings = async () => {
    await this.getManagerContract();
    try {
      const tokenIds: any[] = await this.managerContract.methods.getAllItemIds().call();
      const allListings: RentInfo[] = await Promise.all(tokenIds.map(this.getRentalListingById));
      return allListings
    } catch (e) {
      console.log("ERROR :: getAllListings ::", e);
      return []
    }
  }

  public getRentalListings = async () => {
    await this.getManagerContract();
    try {
      const allListings: RentInfo[] = await this.getAllListings();
      const availableListings: RentInfo[] = allListings.filter(listing => listing.renter == null)
      return availableListings
    } catch (e) {
      console.log("ERROR :: getRentalListings ::", e);
      return []
    }
  }

  public getRentalListingsByOwner = async (ownerAddress: string) => {
    await this.getManagerContract();
    if (ownerAddress == "") {
      ownerAddress = this.account;
    }
    try {
      const allListings: RentInfo[] = await this.getAllListings();
      const ownedListings: RentInfo[] = allListings.filter(listing => listing.originalOwner?.toLowerCase() == ownerAddress.toLowerCase())
      return ownedListings
    } catch (e) {
      console.log("ERROR :: getRentalListingsByOwner ::", e);
      return []
    }
  }

  public getRentalListingsByRenter = async (renterAddress: string) => {
    await this.getManagerContract();
    if (renterAddress == "") {
      renterAddress = this.account;
    }
    try {
      const allListings: RentInfo[] = await this.getAllListings();
      const rentedListings: RentInfo[] = allListings.filter(listing => listing.renter?.toLowerCase() == renterAddress.toLowerCase())
      return rentedListings
    } catch (e) {
      console.log("ERROR :: getRentalListingsByRenter ::", e);
      return []
    }
  }

  public getRentalListingById = async (tokenId: number) => {
    await this.getManagerContract();
    try {
      const result = await this.managerContract.methods.itemIdToRentInfo(tokenId).call({ from: this.account });
      let makeRentInfo = async (listing: any) => {
        let pairing: ERC20Token[] = await this.getPairing(listing.tokenId);
        let position: Position = await this.getPosition(listing.tokenId);
        return {
          tokenId: listing.tokenId,
          originalOwner: listing.originalOwner,
          renter: listing.renter == "0x0000000000000000000000000000000000000000" ? null : listing.renter,
          priceInEther: window.web3.utils.fromWei(listing.price, 'ether'),
          durationInSeconds: listing.duration,
          expiryDate: listing.expiryDate == 0 ? null : new Date(listing.expiryDate*1000),
          pairing: pairing,
          position: position
        } as RentInfo
      }
      return await makeRentInfo(result)
    } catch (e) {
      console.log("ERROR :: getRentalListingById ::", e);
      return {} as RentInfo
    }
  }

  public getNFTSVG = async (tokenId: number) => {
    await this.getNFTMinterContract();
    return await this.NFTMinterContract.methods.tokenURI(tokenId).call()
  }

  public restrictedWithdraw = async () => {
    await this.getManagerContract();
    await this.managerContract.methods.withdraw().send({ from: this.account });
    return true;
  }
}
