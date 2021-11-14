import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CompareValidator } from '../../shared/helpers/form-validators';
import { AccountService } from '../shared/services/account.service';

@Component({
  selector: 'app-account-personal-data',
  templateUrl: './account-personal-data.component.html',
  styleUrls: ['./account-personal-data.component.scss']
})
export class AccountPersonalDataComponent implements OnInit {

  constructor(private _accountService: AccountService,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  private _subscriptions: Subscription[] = [];
  private _userData: any = {};

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
