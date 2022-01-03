import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, IAuthState } from 'src/app/shared/services/auth.services';
import { CompareValidator } from '../../shared/helpers/form-validators';

@Component({
  selector: 'app-account',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.scss']
})
export class AccountCreateComponent {

  public form = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.required,
                                                   Validators.email])),
    // Passwort requirments:
    // - At least 8 characters in length
    // - Lowercase letters
    // - Uppercase letters
    password: new FormControl('', Validators.compose([Validators.required,
                                  Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')])),
    passwordConfirm: new FormControl('', Validators.compose([Validators.required,
                                                             CompareValidator('password')]))
    }
  )
  public isSpinnerActive: boolean = false;

  constructor(private _authService: AuthService,
              private _snackBar: MatSnackBar) { }

  onSubmitForm(): void {
    if(this.form.valid) {
      this.isSpinnerActive = true;
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;
      this._authService.createAccount(email, password)
      .then((res: IAuthState) => {
        this.isSpinnerActive = false;
        this._snackBar.open(res.messageText);
        setTimeout(() => {
          this._snackBar.dismiss();
        }, 3000)
      })
    }
  }

  closeSnackBar() {
    this._snackBar.dismiss();
  }

  sendEmailValidation() {
    this.isSpinnerActive = true;
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;
    if(email !== '' && password !== '') {
      this._authService.sendEmailValidationLink(email, password)
      .then((res: IAuthState) => {
        this.isSpinnerActive = false;
        this._snackBar.open(res.messageText);
        setTimeout(() => {
          this._snackBar.dismiss();
        }, 3000)
      })
    } else {
      this._snackBar.open('E-Mail und Passwortfeld ausfüllen');
      setTimeout(() => {
        this._snackBar.dismiss();
      }, 3000)
    }
  }

}
