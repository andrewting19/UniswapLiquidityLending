import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RentalListingDetailsComponent } from './components/rentals/rental-listing-details/rental-listing-details.component';
import { RentalListingsComponent } from './components/rentals/rental-listings/rental-listings.component';
import { NewRentalListingComponent } from './components/rentals/new-rental-listing/new-rental-listing.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SaleListingsComponent } from './components/sales/sale-listings/sale-listings.component';
import { NewSaleListingComponent } from './components/sales/new-sale-listing/new-sale-listing.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'rent', component: RentalListingsComponent },
  { path: 'lend', component: NewRentalListingComponent },
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
