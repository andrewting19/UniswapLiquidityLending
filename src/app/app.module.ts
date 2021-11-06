import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RentalListingsComponent } from './components/marketplace/rental-listings/rental-listings.component';
import { NewListingComponent } from './components/marketplace/new-listing/new-listing.component';
import { ListingComponent } from './components/marketplace/listing/listing.component';
import { RentalListingDetailsComponent } from './components/marketplace/rental-listing-details/rental-listing-details.component';
import { SaleListingsComponent } from './components/sales/sale-listings/sale-listings.component';
import { SaleListingDetailsComponent } from './components/sales/sale-listing-details/sale-listing-details.component';
import { NewSaleListingComponent } from './components/sales/new-sale-listing/new-sale-listing.component';
import { SaleListingComponent } from './components/sales/sale-listing/sale-listing.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    RentalListingsComponent,
    NewListingComponent,
    ListingComponent,
    RentalListingDetailsComponent,
    SaleListingComponent,
    SaleListingsComponent,
    SaleListingDetailsComponent,
    NewSaleListingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatInputModule, 
    MatIconModule,
    MatFormFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
