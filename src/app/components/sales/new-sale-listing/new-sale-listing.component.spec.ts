import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSaleListingComponent } from './new-sale-listing.component';

describe('NewListingComponent', () => {
  let component: NewSaleListingComponent;
  let fixture: ComponentFixture<NewSaleListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSaleListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSaleListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
