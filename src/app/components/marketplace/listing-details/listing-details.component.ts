import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-listing-details',
  templateUrl: './listing-details.component.html',
  styleUrls: ['./listing-details.component.css']
})
export class ListingDetailsComponent implements OnInit {
  tokenId: any;

  constructor(private router: Router) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.tokenId = this.router.url.split("/").pop();
        console.log(this.tokenId)
      }
    })
  }

  ngOnInit(): void {
    console.log("ngOnInit")
  }

}
