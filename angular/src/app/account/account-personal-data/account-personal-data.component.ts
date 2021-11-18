import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AccountService } from '../shared/services/account.service';

@Component({
  selector: 'app-account-personal-data',
  templateUrl: './account-personal-data.component.html',
  styleUrls: ['./account-personal-data.component.scss']
})
export class AccountPersonalDataComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar,
              private _accountService: AccountService) { }

  ngOnInit(): void {
    this._accountService.getUser()
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    })
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  private _subscriptions: Subscription[] = [];

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
    this._accountService.updateUser({email: 'bruno_churchi@gmx.ch',
                                     firstName:  null,
                                     lastName: null,
                                     street: null,
                                     zip: null,
                                     city: null,
                                     country: null,
                                     phone:  null,
                                     accountNumber: null
                                    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    })
  }

  closeSnackBar() {
    this._snackBar.dismiss();
  }



}



