import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';

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

  constructor( private contractService: ContractService) { }

  ngOnInit(): void {
    this.refresh();
  }

  async refresh() {
    this.manager = await this.contractService.getManagerAddress();
    this.players = await this.contractService.getPlayerAddresses();
    this.balance = await this.contractService.getLotteryBalance();
    console.log(this.manager, this.players, this.balance)
  }

  async enterLottery() {
    this.status = "Trying to enter..."
    await this.contractService.enterLottery(this.amountToEnter);
    this.status = "Entered " + this.amountToEnter.toString() + " ether successfully"
    this.amountToEnter = 0;
    this.refresh();
  }


}
