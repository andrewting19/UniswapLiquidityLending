import { Injectable } from '@angular/core';
import Web3 from "web3";

declare const window: any;

const address = "0xFc83A58EfA2e49d13d7849c94E2A7b3238e673d4";
const abi = [{"constant":true,"inputs":[],"name":"manager","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pickWinner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getPlayers","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"enter","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"players","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]


@Injectable({
  providedIn: 'root'
})
export class ContractService {
  window: any;
  lotteryContract: any = null;
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
      console.log("service",addresses)
      if (!addresses.length) {
          try {
            addresses = await window.ethereum.enable();
          } catch (e) {
            console.log("ERROR :: openMetamask ::", e)
            return false;
          }
      }
      this.getLotteryContract();
      return addresses.length ? addresses[0] : null;
  };

  public getLotteryContract = async () => {
    if (!this.lotteryContract) {
      this.lotteryContract = new window.web3.eth.Contract(
        abi,
        address,
      );  
    }
  }

  public getManagerAddress = async () => {
    await this.getLotteryContract();
    return await this.lotteryContract.methods.manager().call();
  }

  public getPlayerAddresses = async () => {
    await this.getLotteryContract();
    return await this.lotteryContract.methods.getPlayers().call();

  }

  public getLotteryBalance = async () => {
    await this.getLotteryContract();
    return window.web3.utils.fromWei(await window.web3.eth.getBalance(this.lotteryContract.options.address), 'ether');
  }

  public enterLottery = async (amountInEther: any) => {
    await this.getLotteryContract();
    try {
      console.log(this.account)
      await this.lotteryContract.methods.enter().send({
        from: this.account,
        value: window.web3.utils.toWei(amountInEther, 'ether')
      })
      return true
    } catch (e) {
      console.log("ERROR :: enterLottery ::", e)
      return false
    }
  }

  public tryPickLotteryWinner= async () => {
    await this.getLotteryContract();
    try {
      await this.lotteryContract.methods.pickWinner().send({
        from: this.account
      });
      return true;
    } catch (e) {
      console.log("ERROR :: tryPickLotteryWinner ::", e)
      return false;
    }
    
  }
}
