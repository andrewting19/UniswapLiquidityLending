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
  durationMultiplier: any;

  constructor(private contractService: ContractService) { }

  ngOnInit(): void {
    this.loading = true;
    this.getListings();
    this.durationMultiplier = {
      's': 1,
      'm': 60,
      'h': 3600,
      'd': 86400,
      'w': 604800
    }
  }

  async getListings() {
    this.listings = await this.contractService.getRentalListings();
    this.loading = false;
    console.log(this.listings)
  }

  async purchaseListing(listing: RentInfo) {
    this.loading = true;
    let result = await this.contractService.rent(listing.tokenId, listing.priceInEther);
    this.loading = false;
    this.getListings();
  }

  deltaToString(delta: number) {
    if (delta < 0) {
      return "Expired"
    }
    let prefix: string = " seconds"
    if (delta > this.durationMultiplier.w) {
      //seconds to minutes
      delta = delta/this.durationMultiplier.w;
      prefix = " weeks"
    }
    if (delta > this.durationMultiplier.d) {
      //minutes to hours
      delta = delta/this.durationMultiplier.d;
      prefix = " days"
    }
    if (delta > this.durationMultiplier.h) {
      delta = delta/this.durationMultiplier.h
      prefix = " hours"
    }
    if (delta > this.durationMultiplier.m) {
      delta = delta/this.durationMultiplier.m
      prefix = " minutes"
    }
    return delta.toFixed(2) + prefix
  }

}
