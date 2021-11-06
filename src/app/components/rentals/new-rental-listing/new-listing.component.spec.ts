import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRentalListingComponent } from './new-rental-listing.component';

describe('NewListingComponent', () => {
  let component: NewRentalListingComponent;
  let fixture: ComponentFixture<NewRentalListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRentalListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRentalListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
