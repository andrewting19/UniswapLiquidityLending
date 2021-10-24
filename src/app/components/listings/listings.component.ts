import { Component, OnInit } from '@angular/core';
import { RentInfo } from 'src/app/models/interfaces';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {
  listings: RentInfo[] = [];

  constructor(private contractService: ContractService) { }

  ngOnInit(): void {
    let setup = async () => {
      this.listings = await this.contractService.getRentalListings();
    }
    setup();
  }

  purchaseListing(listing: RentInfo) {

  }

  secondsToString(seconds: number) {
    
  }

}
