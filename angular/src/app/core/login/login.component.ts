import { ICurrentUser } from '../global';

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, IAuthRes } from '../services/auth.services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Declarations
  ////////////////////////////////////////////////////////////////////////////////////////////////

  // public returnUrl: string = '';
  public form = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.required,
                                                   Validators.email])),
    password: new FormControl('', Validators.compose([Validators.required]))
  });
  public isSpinnerActive: boolean = false;

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////


  constructor( // private _route: ActivatedRoute,
              private _router: Router,
              private _authService: AuthService,
              private _snackBar: MatSnackBar) { }

  ngOnInit() {
    // this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
  }


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
          this._router.navigate([localStorage.getItem('redirectTo')]);
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
