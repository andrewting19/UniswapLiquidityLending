import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RenterContractService } from 'src/app/services/contracts/renterContract.service';

@Component({
  selector: 'app-new-rental-listing',
  templateUrl: './new-rental-listing.component.html',
  styleUrls: ['./new-rental-listing.component.css']
})
export class NewRentalListingComponent implements OnInit {
  error: boolean = false;
  postError: boolean = false;
  loading: boolean = false;
  form: any;
  tokenId = new FormControl('', [Validators.required]);
  priceInEther = new FormControl('', [Validators.required, Validators.pattern("^([0-9]+\.?[0-9]*|\.[0-9]+)$")]);
  duration = new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]);
  durationUnits = new FormControl('d', [Validators.required]);
  durationMultiplier: any;
  //s = seconds, m = minutes, h = hours, d = days, w = weeks

  constructor(private renterContractService: RenterContractService) {
  }

  ngOnInit(): void {
    this.durationMultiplier = {
      's': 1,
      'm': 60,
      'h': 3600,
      'd': 86400,
      'w': 604800
    }
    this.form = new FormGroup({
      tokenId: this.tokenId,
      priceInEther: this.priceInEther,
      duration: this.duration,
      durationUnits: this.durationUnits
    })
    // console.log(await this.renterContractService.createNewRental(7597, .5, 100000, poolAddr));
  }

  submitForm() {
    let submit = async () => {
      this.loading = true;
      const result = await this.renterContractService.createNewRental(
        this.tokenId.value, 
        parseFloat(this.priceInEther.value), 
        parseInt(this.duration.value) * this.durationMultiplier[this.durationUnits.value]
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
