import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, IAuthState } from './auth.services';
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

  private _isLoggedIn: boolean = false;
  private _subscriptions: Subscription[] = [];
  private _redirectUrl: string = '/';

  public form = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.required,
                                                   Validators.email])),
    password: new FormControl('', Validators.compose([Validators.required]))
  });
  public isSpinnerActive: boolean = false;
  public isPasswordResetActive: boolean = false;


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private _authService: AuthService,
              private _snackBar: MatSnackBar) {

    this._subscriptions.push(
      this._authService.loggedInState$.subscribe({
        next: data => this._isLoggedIn = data.loginState,
      })
    );
  }

  ngOnInit() {
    this._subscriptions.push(
      this._route.queryParams.subscribe(params => {
        const redirectUrl = params['redirectUrl'];
        if(redirectUrl !== undefined) {
          this._redirectUrl = redirectUrl;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Form Search (Login To Firestore)
  ////////////////////////////////////////////////////////////////////////////////////////////////

  onSubmitForm(): void {
    if(this.form.valid) {
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;
      this._authService.login(email, password)
      .then((res: IAuthState) => {
        this._snackBar.open(res.messageText);
        if(this._isLoggedIn) {
          this._router.navigate([this._redirectUrl]);
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
    const email = this.form.get('email')?.value;

    if(email) {
      this._authService.sendPasswordResetEmail(email)
      .then((res: IAuthState) => {
        this._snackBar.open(res.messageText);
      })
      .catch((error) => {
        console.log(error);
      });

    } else {
      this._snackBar.open('Bitte gültige E-Mail Adresse angeben');
    }

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Event functions
  ////////////////////////////////////////////////////////////////////////////////////////////////

  closeSnackBar() {
    this._snackBar.dismiss();
  }

}
