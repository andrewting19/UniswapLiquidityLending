import { Component, OnInit } from '@angular/core';
import { getMatIconFailedToSanitizeUrlError } from '@angular/material/icon';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ListingInfo, ListingTypes, RentInfo } from 'src/app/models/interfaces';
import { RenterContractService } from 'src/app/services/contracts/renterContract.service';
import { SalesContractService } from 'src/app/services/contracts/salesContract.service';
import graphAPI, { graphAPIURL } from 'src/data_handling/api';
import { DomSanitizer } from '@angular/platform-browser';
import { CoingeckoService } from 'src/app/services/coingecko.service';


@Component({
  selector: 'app-listing-details',
  templateUrl: './listing-details.component.html',
  styleUrls: ['./listing-details.component.css']
})
export class ListingDetailsComponent implements OnInit {
  tokenId: any;
  graphAPI: any;
  listingType: ListingTypes = ListingTypes.Null;
  listing: RentInfo = {} as RentInfo;
  loading: boolean = true;
  isSeller: boolean = false;
  isBuyer: boolean = false;
  private contractService: any;
  durationMultiplier: any;
  nftSvg: any;
  ethPrice: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private renterContractService: RenterContractService,
    private salesContractService: SalesContractService,
    private priceService: CoingeckoService,
    private domSanitizer: DomSanitizer
  ) {
    this.graphAPI = new graphAPI(graphAPIURL);
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.tokenId = this.router.url.split("/").pop();
        this.getListingInfo();
      }
    });
    this.durationMultiplier = {
      's': 1,
      'm': 60,
      'h': 3600,
      'd': 86400,
      'w': 604800
    }
  }

  ngOnInit(): void {
    let setup = async () => {
      this.ethPrice = await this.priceService.getEthPrice();
    }
    setup();
  }

  isNullListing() {
    return this.listingType == ListingTypes.Null;
  }

  getListingInfo() {
    if (this.listingType == ListingTypes.Null) {
      this.getRentalInfo();
      this.getSaleInfo();
    } else if (this.listingType == ListingTypes.Rental) {
      this.getRentalInfo();
    } else {
      this.getSaleInfo();
    }
  }

  getRentalInfo = async () => {
    let result = await this.renterContractService.getRentalListingById(this.tokenId);
    if (result.tokenId != null && result.tokenId != 0) {
      this.listingType = ListingTypes.Rental;
      this.listing = result;
      this.loading = false;
      this.onGetListingInfo();
    }
  }

  getSaleInfo = async () => {
    let result = await this.salesContractService.getSalesListingById(this.tokenId);
    if (result.tokenId != null && result.tokenId != 0) {
      this.listingType = ListingTypes.Sale;
      // this.listing = result;
      this.contractService = this.salesContractService;
      this.loading = false;
    }
  }

  onGetListingInfo = async () => {
    this.isSeller = this.listing.seller.toLowerCase() == this.renterContractService.account.toLowerCase();
    this.isBuyer = this.listing.buyer ? this.listing.buyer.toLowerCase() == this.renterContractService.account.toLowerCase() : false;
    this.getNFTImg();
    let feeTierDist = await this.graphAPI.getFeeTierDistribution(this.listing.pairing[0].address, this.listing.pairing[1].address)
    console.log(feeTierDist)
    let poolInfo = await this.graphAPI.getPoolInfo(this.listing.position.pool);
    console.log(poolInfo)
    let lastSwaps = await this.graphAPI.getLastXSwaps(this.listing.position.pool, 1000)
    console.log(lastSwaps)
    console.log(this.listing.position.pool)
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
  }

  async reclaimLiquidity() {
    this.loading = true;
    let result = await this.renterContractService.returnRentalToOwner(this.listing.tokenId);
    console.log("reclaimLiquidity:",this.listing.tokenId,result);
    this.loading = false;
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

  getPriceRange(useToShowPrice: boolean, lower: boolean) {
    let i = useToShowPrice? this.listing.position.rangeToShow : (this.listing.position.rangeToShow - 1)*-1;
    let r = this.listing.position.priceRange[i];
    let p = lower ? r.lower : r.upper;
    if (p > 1000000000) { //in the billions
      return (p / 1000000000).toFixed(0) + ' Bil'
    } else if (p > 1000000) { //in the millions
      return (p / 1000000).toFixed(2) + ' Mil'
    } else if (p > 1000) {
      return (p / 1000).toFixed(2) + 'k'
    } else if (p > 100) {
      return p.toFixed(2)
    } else if (p < .0001) {
      return "<0.0001"
    } else {
      return p.toFixed(4)
    }
  }

}
