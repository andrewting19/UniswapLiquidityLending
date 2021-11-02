import { Component, OnInit } from '@angular/core';
import { RenterContractService } from 'src/app/services/contracts/renterContract.service';
import { SalesContractService } from 'src/app/services/contracts/salesContract.service';
import { DomSanitizer } from '@angular/platform-browser';
import graphAPI, { graphAPIURL } from 'src/data_handling/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  manager: any;
  players: any;
  balance: any;
  amountToEnter: number = 0;
  status: string = "";
  nftSvg: any;
  graphAPI: any;

  constructor( 
    private renterContractService: RenterContractService,
    private salesContractService: SalesContractService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {    
    this.graphAPI = new graphAPI(graphAPIURL);
    this.refresh();
    
  }

  async refresh() {
    // let pooladdr = "0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8";
    // let t1 = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
    // let t2 = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
    // console.log("TickRange", await this.graphAPI.getTickRangeInfo('0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8', 308160, 309720))
    // console.log("PoolInfo", await this.graphAPI.getPoolInfo('0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8')) 
    // console.log("getSwapsLast1Day", await this.graphAPI.getSwapsFromLastXDays(pooladdr, 2, (new Date()).getTime() / 1000))
    // console.log("getFeeTierDistribution", await this.graphAPI.getFeeTierDistribution(t1, t2))

    // console.log(await this.salesContractService.createNewSellOffer(8161, 0.001));
    // // console.log(await this.salesContractService.deleteSale(7812));
    // console.log(await this.salesContractService.getAllListings());
    // console.log(await this.salesContractService.buy(8161, 0.001));

  }

  async collectFees() {
    console.log(await this.renterContractService.restrictedWithdraw());
    console.log(await this.salesContractService.restrictedWithdraw());
  }
}
