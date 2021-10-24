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
  loading: boolean = false;

  constructor(private contractService: ContractService) { }

  ngOnInit(): void {
    this.getListings();
  }

  async getListings() {
    this.listings = await this.contractService.getRentalListings();
    console.log(this.listings)
  }

  async purchaseListing(listing: RentInfo) {
    this.loading = true;
    let result = await this.contractService.rent(listing.tokenId, listing.priceInEther);
    this.loading = false;
    this.getListings();
  }

  secondsToString(seconds: number) {
    
  }

}
