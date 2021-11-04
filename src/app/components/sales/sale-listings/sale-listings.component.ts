import { Component, OnInit } from '@angular/core';
import { SaleInfo } from 'src/app/models/salesInterfaces';
import { SalesContractService } from 'src/app/services/contracts/salesContract.service';
import { CoingeckoService } from 'src/app/services/coingecko.service';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class SaleListingsComponent implements OnInit {
  listings: SaleInfo[] = [];
  visibleListings: SaleInfo[] = [];
  loading: boolean = false;
  durationMultiplier: any;
  ethPrice: number = 0;
  value = ""
  searchFields = [
    '', '', //token 1 and token 2
    '0.3', //fee
    '', //price in eth
    '', //duration #
    'd', //duration units
    '', //token id
  ]
  operators = ['<', '<']
  operatorMap = (op: string, x: number, y: number) => {
    if (op == "=") return x == y
    else if (op == "<") return x < y
    else if (op == ">") return x > y
    else return false
  }

  constructor(
    private salesContractService: SalesContractService,
    private coinGecko: CoingeckoService
  ) { }

  ngOnInit(): void {
    this.getEthPrice();
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

  async getEthPrice() {
    this.ethPrice = await this.coinGecko.getEthPrice();
  }

  async getListings() {
    this.listings = await this.salesContractService.getAllListings();
    this.visibleListings = [...this.listings];
    this.search();
    this.loading = false;
    console.log(this.listings)
  }

  async purchaseListing(listing: SaleInfo) {
    this.loading = true;
    let result = await this.salesContractService.buy(listing.tokenId, listing.priceInEther);
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

  search() {
    if (!this.listings.length) return;
    let fields = this.searchFields.map((f: any) => f.trim());
    this.visibleListings = this.listings.filter((listing: SaleInfo) => {
      let result = true;
      if (fields[3] != '') {
        result = result && this.operatorMap(this.operators[0], listing.priceInEther, parseFloat(fields[3]));
      }
      return result &&
        listing.pairing[0].symbol.includes(fields[0].toUpperCase()) &&
        listing.pairing[1].symbol.includes(fields[1].toUpperCase()) &&
        listing.position.fee == parseFloat(fields[2]) &&
        listing.tokenId.toString().includes(fields[6])
    });
  }
}
