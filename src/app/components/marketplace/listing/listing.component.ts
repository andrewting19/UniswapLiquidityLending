import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RentInfo } from 'src/app/models/interfaces';
import { RenterContractService } from 'src/app/services/contracts/renterContract.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  @Input() listing: RentInfo = {} as RentInfo;
  @Input() ethPrice: number = 0; 
  @Input() isOwner: boolean = false;
  @Input() isRenter: boolean = false;
  @Output() updateEvent = new EventEmitter<boolean>();
  loading: boolean = false;
  durationMultiplier: any;
  nftSvg: any;

  constructor(
    private renterContractService: RenterContractService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.durationMultiplier = {
      's': 1,
      'm': 60,
      'h': 3600,
      'd': 86400,
      'w': 604800
    }
    this.getNFTImg();
  }

  async getNFTImg() {
    let result = await this.renterContractService.getNFTSVG(this.listing.tokenId);
    const json = atob(result.substring(29));
    result = this.domSanitizer.bypassSecurityTrustUrl(JSON.parse(json).image);
    this.nftSvg = result;
  }

  async purchaseListing() {
    this.loading = true;
    let result = await this.renterContractService.rent(this.listing.tokenId, this.listing.priceInEther);
    this.loading = false;
    this.updateEvent.emit(true);
  }

  async collectFees() {
    this.loading = true;
    let result = await this.renterContractService.withdrawCash(this.listing.tokenId)
    console.log("collectFees:",this.listing.tokenId,result)
    this.loading = false;
  }

  async removeListing() {
    this.loading = true;
    let result = await this.renterContractService.deleteRental(this.listing.tokenId);
    console.log("removeListing:",this.listing.tokenId,result);
    this.loading = false;
    this.updateEvent.emit(true);
  }

  async reclaimLiquidity() {
    this.loading = true;
    let result = await this.renterContractService.returnRentalToOwner(this.listing.tokenId);
    console.log("reclaimLiquidity:",this.listing.tokenId,result);
    this.loading = false;
    this.updateEvent.emit(true);
  }

  timedelta(expiry: any) {
    let now = new Date();
    let delta: number = expiry.getTime()/1000 - now.getTime()/1000;
    return this.deltaToString(delta)
  }

  deltaToString(delta: number) {
    delta = parseFloat(delta.toString())
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
    return delta.toFixed(0) + prefix
  }

}
