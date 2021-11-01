import { Component, OnInit } from '@angular/core';
import { RentInfo } from 'src/app/models/rentInterfaces';
import { RenterContractService } from 'src/app/services/contracts/renterContract.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  ownedListings: RentInfo[] = [];
  rentedListings: RentInfo[] = [];
  loading: boolean = false;
  ownedLoading: boolean = false;
  rentedLoading: boolean = false;
  isOwner: boolean = false;
  durationMultiplier: any;

  constructor(    private renterContractService: RenterContractService) { }

  ngOnInit(): void {
    this.ownedLoading = true;
    this.rentedLoading = true;
    this.getOwned();
    this.getRented();
    this.durationMultiplier = {
      's': 1,
      'm': 60,
      'h': 3600,
      'd': 86400,
      'w': 604800
    }
    
  }

  async collectMarketplaceFees() {
    console.log(await this.renterContractService.restrictedWithdraw());
  }

  async checkIfOwner() {
    this.isOwner = await this.renterContractService.isOwner();
  }

  async getOwned() {
    this.ownedListings = await this.renterContractService.getRentalListingsByOwner("");
    this.ownedLoading = false;
    console.log("Owned:",this.ownedListings)
  }

  async getRented() {
    this.rentedListings = await this.renterContractService.getRentalListingsByRenter("");
    this.rentedLoading = false;
    console.log("Rented:", this.rentedListings)
  }

  timedelta(expiry: any) {
    let now = new Date();
    let delta: number = expiry.getTime()/1000 - now.getTime()/1000;
    return this.deltaToString(delta)
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

  async collectFees(tokenId: number) {
    this.loading = true;
    let result = await this.renterContractService.withdrawCash(tokenId)
    console.log("collectFees:",tokenId,result)
    this.loading = false;
  }

  async removeListing(tokenId: number) {
    this.loading = true;
    let result = await this.renterContractService.deleteRental(tokenId);
    console.log("removeListing:",tokenId,result);
    this.loading = false;
  }

  async reclaimLiquidity(tokenId: number) {
    this.loading = true;
    let result = await this.renterContractService.returnRentalToOwner(tokenId);
    console.log("reclaimLiquidity:",tokenId,result);
    this.loading = false;
  }

}
