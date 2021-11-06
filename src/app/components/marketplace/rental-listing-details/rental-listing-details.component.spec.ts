import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalListingDetailsComponent } from './rental-listing-details.component';

describe('ListingDetailsComponent', () => {
  let component: RentalListingDetailsComponent;
  let fixture: ComponentFixture<RentalListingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentalListingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalListingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
