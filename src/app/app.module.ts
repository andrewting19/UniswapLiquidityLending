import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ListingsComponent } from './components/listings/listings.component';
import { NewListingComponent } from './components/new-listing/new-listing.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    ListingsComponent,
    NewListingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
