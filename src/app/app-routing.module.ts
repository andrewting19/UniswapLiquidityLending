import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RentalListingDetailsComponent } from './components/marketplace/rental-listing-details/rental-listing-details.component';
import { RentalListingsComponent } from './components/marketplace/rental-listings/rental-listings.component';
import { NewListingComponent } from './components/marketplace/new-listing/new-listing.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SaleListingsComponent } from './components/sales/sale-listings/sale-listings.component';
import { NewSaleListingComponent } from './components/sales/new-sale-listing/new-sale-listing.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'listings', component: RentalListingsComponent },
  { path: 'new', component: NewListingComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'listing/:id', component: RentalListingDetailsComponent },
  { path: 'buy', component: SaleListingsComponent },
  { path: 'sell', component: NewSaleListingComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
