import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SalesContractService } from 'src/app/services/contracts/salesContract.service';

@Component({
  selector: 'app-new-listing',
  templateUrl: './new-listing.component.html',
  styleUrls: ['./new-listing.component.css']
})
export class NewSaleListingComponent implements OnInit {
  error: boolean = false;
  postError: boolean = false;
  loading: boolean = false;
  form: any;
  tokenId = new FormControl('', [Validators.required]);
  priceInEther = new FormControl('', [Validators.required, Validators.pattern("^([0-9]+\.?[0-9]*|\.[0-9]+)$")]);

  constructor(private salesContractService: SalesContractService) {
  }

  ngOnInit(): void {

    this.form = new FormGroup({
      tokenId: this.tokenId,
      priceInEther: this.priceInEther,
    })
    // console.log(await this.renterContractService.createNewRental(7597, .5, 100000, poolAddr));
  }

  submitForm() {
    let submit = async () => {
      this.loading = true;
      const result = await this.salesContractService.createNewSellOffer(
        this.tokenId.value, 
        parseFloat(this.priceInEther.value), 
      );
      console.log(result);
      this.loading = false;
      if (!result) {
        this.postError = true;
      }
    }
    if (this.form.invalid) {
      console.log("Form has validation errors");
      this.error = true;
      return
    }
    submit();
  }

}
