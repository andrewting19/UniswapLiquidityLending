import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import { DomSanitizer } from '@angular/platform-browser';

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

  constructor( 
    private contractService: ContractService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {    
  }

  async refresh() {
    // this.manager = await this.contractService.getManagerAddress();
    // this.players = await this.contractService.getPlayerAddresses();
    // this.balance = await this.contractService.getLotteryBalance();
    // console.log(this.manager, this.players, this.balance)
    let poolAddr = "0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8";
    // await this.contractService.approveTransfer(7595);
    // console.log(await this.contractService.createNewRental(7600, .0001, 100000, poolAddr));
    // console.log(await this.contractService.withdrawCash(7600));
    // console.log(await this.contractService.getRentalListingById(7602));
    // console.log(await this.contractService.rent(7600, 0.0001));
    // console.log(await this.contractService.getRentalListingById(7595));
    // console.log(await this.contractService.getRentalListingById(7586));
    console.log(await this.contractService.deleteRental(7605));
    // this.nftSvg = await this.getNFTImg(7597) 
  }

  async collectFees() {
    console.log(await this.contractService.restrictedWithdraw());
  }
}
