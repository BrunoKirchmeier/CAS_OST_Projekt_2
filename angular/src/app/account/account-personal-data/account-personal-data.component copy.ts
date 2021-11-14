import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.services';
import { CompareValidator } from '../../shared/helpers/form-validators';

@Component({
  selector: '',
  template: '<div>',
  styleUrls: []
})
export class AccountPersonalDataComponent2 implements OnInit {

  constructor(private _authService: AuthService,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this._subscriptions.push(
      this._authService.loggedInState$.subscribe({
        next: (data) => {
          try {
            this.currentUser = JSON.parse(data.currentUser);
          } catch {}
        }
      })
    );

    this.form.patchValue({

    })
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  private _subscriptions: Subscription[] = [];
  private currentUser: any = {};
  private userData: any = {};

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
