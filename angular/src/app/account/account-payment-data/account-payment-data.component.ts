import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-account-payment-data',
  templateUrl: './account-payment-data.component.html',
  styleUrls: ['./account-payment-data.component.scss']
})
export class AccountPaymentDataComponent {

  constructor(private _snackBar: MatSnackBar) { }

  public form = new FormGroup({
    firstName: new FormControl('', Validators.compose([])),
    lastName: new FormControl('', Validators.compose([])),
    street: new FormControl('', Validators.compose([])),
    zip: new FormControl('', Validators.compose([])),
    city: new FormControl('', Validators.compose([])),
    country: new FormControl('', Validators.compose([])),
    phone: new FormControl('', Validators.compose([])),
    accountNumber: new FormControl('', Validators.compose([])),
  });
  public isSpinnerActive: boolean = false;

  onSubmitForm() {}

  closeSnackBar() {
    this._snackBar.dismiss();
  }

}
