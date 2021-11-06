import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalListingsComponent } from './rental-listings.component';

describe('ListingsComponent', () => {
  let component: RentalListingsComponent;
  let fixture: ComponentFixture<RentalListingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentalListingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
