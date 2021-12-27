import { Injectable } from '@angular/core';
import Web3 from "web3";
import { ERC20Token, Position, PriceRange, RentInfo } from 'src/app/models/interfaces';
import { router01ABI } from 'src/app/models/router01ABI';
import { rentFactoryABI } from 'src/app/models/rentFactoryABI';

declare const window: any;
const Router01Address = "0xCb301231Db8830707C3F8595628B464fbd3F6Fa2"; //Address of our custom smart contract
const FactoryAddress = "0xBd499160fA963f01e2050cdF05e1221D6b684a32";// address of factory for testing purposes


@Injectable({
    providedIn: 'root'
  })
export class router01ContractService {
    window: any;
    router01Contract: any = null;
    factoryContract:any = null;
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
        this.getRouterContract();
        return addresses.length ? addresses[0] : null;
    };

    public getRouterContract = async () => {
    if (!this.account) {
        this.account = await this.openMetamask();
    }
    if (!this.router01Contract) {
        this.router01Contract = new window.web3.eth.Contract(
        router01ABI,
        Router01Address,
        );
        }
    }

    public getFactoryContract = async () => {
        if (!this.account) {
            this.account = await this.openMetamask();
        }
        if (!this.factoryContract) {
            this.factoryContract = new window.web3.eth.Contract(
            rentFactoryABI,
            FactoryAddress,
            );
            }
        }

    public getRentalPrice = async(tickUpper: number, tickLower: number, durationInSeconds: number, uniswapV3PoolAddr: string) => {
        await this.getRouterContract();

        try {
            return this.router01Contract.methods.getRentalPrice(tickUpper, tickLower, durationInSeconds, uniswapV3PoolAddr).send({from: this.account});
        }
        catch (e) {
            console.log("ERROR :: getRentalPrice ::", e);
            return -1;

    }
}

    public createPool = async(tokenAddr: string) => {
        await this.getFactoryContract();

        try {
           this.factoryContract.methods.createPool(tokenAddr).send({from: this.account});
        }
        catch (e) {
            console.log("ERROR :: createPool ::", e);
            return -1;

    }
    return 1;



}

}