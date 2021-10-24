import { Injectable } from '@angular/core';
import Web3 from "web3";
import { ERC20Token, RentInfo, Position } from 'src/app/models/interfaces';
import { ERC20ABI, myABI, poolABI, NFTMinterABI } from 'src/app/models/abi';

declare const window: any;

const address = "0x215a56BcC26653C554cF63ddefD3fD329ba9Ebd0"; //Address of our custom smart contract
const NFTMinterAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; //Hard coded address of Uniswap NFT Minter contract

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  window: any;
  lotteryContract: any = null;
  managerContract: any = null;
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
      console.log(this.managerContract)
    }
  }

  public getNFTMinterContract = async () => {
    return new window.web3.eth.Contract(NFTMinterABI, NFTMinterAddress)
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
    await this.getManagerContract();
    try {
      const position = await this.managerContract.methods.positions(tokenId).call();
      return {
        tickUpper: position.tickUpper,
        tickLower: position.tickLower,
        liquidity: position.liquidity,
        feeGrowth: [position.feeGrowthInside0LastX128, position.feeGrowthInside1LastX128],
        tokensOwed: [position.tokensOwed0, position.tokensOwed1]
      } as Position
      return true
    } catch (e) {
      console.log("ERROR :: getPosition ::", e);
      return false
    }
  }

  public approveTransfer = async (tokenId: number) => {
    await this.getManagerContract();
    const NFTMinterContract = await this.getNFTMinterContract();
    try {
      console.log(await NFTMinterContract.methods.approve(address, tokenId).send({from: this.account}));
      return true
    } catch (e) {
      console.log("ERROR :: approveTransfer ::", e);
      return false
    }
  }

  public createNewRental = async (tokenId: number, priceInEther: number, durationInSeconds: number, poolAddress: string) => {
    await this.getManagerContract();
    try {
      console.log(await this.approveTransfer(tokenId));
      console.log("asdfasdf")
      await this.managerContract.methods.putUpNFTForRent(
        tokenId, 
        window.web3.utils.toWei(priceInEther.toString(), 'ether'),
        durationInSeconds,
        poolAddress
      ).send({from: this.account});
      return true;
    } catch (e) {
      console.log("ERROR :: createNewRental ::", e);
      return false;
    }
  }

  public deleteRental = async (tokenId: number) => {
    await this.getManagerContract();
    console.log(this.account);
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

  public withdrawCash = async (tokenId: number) => {
    await this.getManagerContract();
    try {
      await this.managerContract.methods.withdrawCash(
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
      ).call();
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
      console.log("tokenIds:", tokenIds)
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
    console.log(this.managerContract)
    try {
      const result = await this.managerContract.methods.itemIdToRentInfo(tokenId).call({ from: this.account });
      let makeRentInfo = async (listing: any) => {
        let pairing: ERC20Token[] = await this.getPairing(listing.tokenId)
        console.log("Pairing:",pairing)
        return {
          tokenId: listing.tokenId,
          originalOwner: listing.originalOwner,
          renter: listing.renter == "0x0000000000000000000000000000000000000000" ? null : listing.renter,
          priceInEther: window.web3.utils.fromWei(listing.price, 'ether'),
          durationInSeconds: listing.duration,
          expiryDate: listing.expiryDate == 0 ? null : new Date(listing.expiryDate*1000),
          pairing: pairing
        } as RentInfo
      }
      return await makeRentInfo(result)
    } catch (e) {
      console.log("ERROR :: getRentalListingById ::", e);
      return {} as RentInfo
    }
  }

  public getNFTSVG = async (tokenId: number) => {
    let NFTMinterContract = await this.getNFTMinterContract();
    return await NFTMinterContract.methods.tokenURI(tokenId).call()
  }

  // public getManagerAddress = async () => {
  //   await this.getLotteryContract();
  //   return await this.lotteryContract.methods.manager().call();
  // }

  // public getPlayerAddresses = async () => {
  //   await this.getLotteryContract();
  //   return await this.lotteryContract.methods.getPlayers().call();

  // }

  // public getLotteryBalance = async () => {
  //   await this.getLotteryContract();
  //   return window.web3.utils.fromWei(await window.web3.eth.getBalance(this.lotteryContract.options.address), 'ether');
  // }

  // public enterLottery = async (amountInEther: any) => {
  //   await this.getLotteryContract();
  //   try {
  //     console.log(this.account)
  //     await this.lotteryContract.methods.enter().send({
  //       from: this.account,
  //       value: window.web3.utils.toWei(amountInEther, 'ether')
  //     })
  //     return true
  //   } catch (e) {
  //     console.log("ERROR :: enterLottery ::", e)
  //     return false
  //   }
  // }

  // public tryPickLotteryWinner= async () => {
  //   await this.getLotteryContract();
  //   try {
  //     await this.lotteryContract.methods.pickWinner().send({
  //       from: this.account
  //     });
  //     return true;
  //   } catch (e) {
  //     console.log("ERROR :: tryPickLotteryWinner ::", e)
  //     return false;
  //   }
    
  // }
}
