import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleListingDetailsComponent } from './sale-listing-details.component';

describe('ListingDetailsComponent', () => {
  let component: SaleListingDetailsComponent;
  let fixture: ComponentFixture<SaleListingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleListingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleListingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
