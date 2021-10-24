import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListingsComponent } from './components/listings/listings.component';
import { NewListingComponent } from './components/new-listing/new-listing.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'rent', component: ListingsComponent },
  { path: 'lend', component: NewListingComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
