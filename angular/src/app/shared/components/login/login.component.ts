import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, IAuthState } from '../../services/auth.services';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

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

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private _authService: AuthService,
              private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this._subscriptions.push(
      this._route.queryParams.subscribe(params => {
        const redirectUrl = params['redirectUrl'];
        if(redirectUrl !== undefined) {
          this._redirectUrl = redirectUrl;
        }
      })
    );
    this._subscriptions.push(
      this._authService.onChangeloggedInState$.subscribe({
        next: data => this._isLoggedIn = data.loginState,
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

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
    }
  }

  resetPassword() {
    const email = this.form.get('email')?.value;
    if(email) {
      this._authService.sendPasswordResetEmail(email)
      .then((res: IAuthState) => {
        this._snackBar.open(res.messageText);
      })
    } else {
      this._snackBar.open('Bitte gültige E-Mail Adresse angeben');
    }
  }

  closeSnackBar() {
    this._snackBar.dismiss();
  }

}
