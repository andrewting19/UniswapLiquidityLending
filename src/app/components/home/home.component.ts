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
    this.refresh();
    
  }

  async refresh() {
    // this.manager = await this.contractService.getManagerAddress();
    // this.players = await this.contractService.getPlayerAddresses();
    // this.balance = await this.contractService.getLotteryBalance();
    // console.log(this.manager, this.players, this.balance)
    let poolAddr = "0x1d42064fc4beb5f8aaf85f4617ae8b3b5b8bd801";
    // await this.contractService.approveTransfer(7597);
    console.log(await this.contractService.createNewRental(7597, .5, 100000, poolAddr));
    console.log(await this.contractService.getRentalListingById(7597))
    console.log(await this.contractService.deleteRental(7597))
    console.log(await this.contractService.getRentalListingById(7597))
    this.nftSvg = await this.getNFTImg(7597)
  }

  async getNFTImg(tokenId: number) {
    let result = await this.contractService.getNFTSVG(tokenId);
    const json = atob(result.substring(29));
    result = this.domSanitizer.bypassSecurityTrustUrl(JSON.parse(json).image);
    console.log(result);
    return result
  }

  // async enterLottery() {
  //   this.status = "Trying to enter..."
  //   await this.contractService.enterLottery(this.amountToEnter);
  //   this.status = "Entered " + this.amountToEnter.toString() + " ether successfully"
  //   this.amountToEnter = 0;
  //   this.refresh();
  // }


}
