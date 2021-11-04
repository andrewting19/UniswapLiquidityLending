import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleListingsComponent } from './sale-listings.component';

describe('ListingsComponent', () => {
  let component: SaleListingsComponent;
  let fixture: ComponentFixture<SaleListingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleListingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
