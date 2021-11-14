import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/shared/services/auth.services';
import { CompareValidator } from '../../shared/helpers/form-validators';

@Component({
  selector: 'app-account-personal-data',
  templateUrl: './account-personal-data.component.html',
  styleUrls: ['./account-personal-data.component.scss']
})
export class AccountPersonalDataComponent implements OnInit {

  constructor(private _authService: AuthService,
             private _snackBar: MatSnackBar) { }

  ngOnInit(): void {}

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










  onSubmitForm() {

  }


  closeSnackBar() {
    this._snackBar.dismiss();
  }



}