import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListingDetailsComponent } from './components/rentals/rental-listing-details/rental-listing-details.component';
import { ListingsComponent } from './components/rentals/rental-listings/rental-listings.component';
import { NewListingComponent } from './components/rentals/new-rental-listing/new-rental-listing.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'rent', component: ListingsComponent },
  { path: 'lend', component: NewListingComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'listing/:id', component: ListingDetailsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
