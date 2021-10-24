import { Injectable } from '@angular/core';
import Web3 from "web3";
import { ERC20Token, RentInfo } from 'src/app/models/interfaces';
import { ERC20ABI, myABI, poolABI, NFTMinterABI } from 'src/app/models/abi';

declare const window: any;

const address = "0xc79226118CB5aee4d6d35654132b987c1aB56aAe";
const NFTMinterAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
const abi = [{"constant":true,"inputs":[],"name":"manager","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pickWinner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getPlayers","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"enter","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"players","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]


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
    const tokens = await this.managerContract.methods.itemIdToTokenAddrs(tokenId).call();
    const tokenInfo: ERC20Token[] = [await this.getERC20TokenInfoFromAddress(tokens.token0Addr), await this.getERC20TokenInfoFromAddress(tokens.token1Addr)]
    return tokenInfo;
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
        value: window.web3.utils.toWei(priceInEther, 'ether')
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
      ).call();
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

  public getRentalListings = async (num?: number) => {
    // let listings: RentInfo[] = [
    //   { 
    //     tokenId: 1, originalOwner: 'abcdefg', renter: null, priceInEther: 1, durationInSeconds: 2629743.83, expiryDate: null, 
    //     pairing: [await this.getERC20TokenInfoFromAddress('0x63f6b6439fd32610f460e2199aa263eb0559abc9'), await this.getERC20TokenInfoFromAddress('0x02f055b6719919d69af7c63c8ab4abb380383925')] 
    //   } as RentInfo,
    //   { 
    //     tokenId: 2, originalOwner: 'hijklmnop', renter: null, priceInEther: 0.15, durationInSeconds: 604800, expiryDate: null,
    //     pairing: [await this.getERC20TokenInfoFromAddress('0x63f6b6439fd32610f460e2199aa263eb0559abc9'), await this.getERC20TokenInfoFromAddress('0x02f055b6719919d69af7c63c8ab4abb380383925')] 
    //   } as RentInfo
    // ]
    // return listings;

    await this.getManagerContract();
    try {
      const result: any[] = await this.managerContract.methods.getAllNFTsForRent().call();
      let makeRentInfo = async (listing: any) => {
        let pairing: ERC20Token[] = await this.getPairing(listing.tokenId)
        return {
          tokenId: listing.tokenId,
          originalOwner: listing.originalOwner,
          renter: null,
          priceInEther: window.web3.utils.fromWei(listing.price, 'ether'),
          durationInSeconds: listing.duration,
          expiryDate: null,
          pairing: pairing
        } as RentInfo
      } 
      const listings: RentInfo[] = await Promise.all(result.map(makeRentInfo))
      return listings
    } catch (e) {
      console.log("ERROR :: getRentalListings ::", e);
      return []
    }
  }

  public getRentalListingsByOwner = async (ownerAddress: string) => {

  }

  public getRentalListingsByRenter = async (renterAddress: string) => {

  }

  public getRentalListingById = async (tokenId: number) => {
    await this.getManagerContract();
    console.log(this.managerContract)
    try {
      const result = await this.managerContract.methods.itemIdToRentInfo(tokenId).call({ from: this.account });
      let makeRentInfo = async (listing: any) => {
        // let pairing: ERC20Token[] = await this.getPairing(listing.tokenId)
        return {
          tokenId: listing.tokenId,
          originalOwner: listing.originalOwner,
          renter: null,
          priceInEther: window.web3.utils.fromWei(listing.price, 'ether'),
          durationInSeconds: listing.duration,
          expiryDate: null
        } 
      }
      return await makeRentInfo(result)
    } catch (e) {
      console.log("ERROR :: getRentalListingById ::", e);
      return
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
