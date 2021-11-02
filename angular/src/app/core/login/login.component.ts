import { ICurrentUser } from '../global';

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, IAuthRes } from '../services/auth.services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Declarations
  ////////////////////////////////////////////////////////////////////////////////////////////////

  public form = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.required,
                                                   Validators.email])),
    password: new FormControl('', Validators.compose([Validators.required]))
  });
  public isSpinnerActive: boolean = false;

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(private _router: Router,
              private _authService: AuthService,
              private _snackBar: MatSnackBar) { }

  ngOnInit() {}


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Form Search (Login To Firestore)
  ////////////////////////////////////////////////////////////////////////////////////////////////

  onSubmitForm(): void {
    if(this.form.valid) {
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;
      this._authService.login(email, password)
      .then((res: IAuthRes) => {
        this._snackBar.open(res.message_ch);
        if (localStorage.getItem('currentUser')) {
          const redirect = localStorage.getItem('redirectTo');
          localStorage.removeItem('redirectTo');
          this._router.navigate([redirect]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Event Functions
  ////////////////////////////////////////////////////////////////////////////////////////////////

  resetPassword() {

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Event functions
  ////////////////////////////////////////////////////////////////////////////////////////////////

  closeSnackBar() {
    this._snackBar.dismiss();
  }

}
