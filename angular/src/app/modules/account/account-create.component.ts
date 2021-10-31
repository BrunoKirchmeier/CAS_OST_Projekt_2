import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, IAuthRes } from 'src/app/core/services/auth.services';
import { CompareValidator } from '../../core/helpers/form-validators';;

@Component({
  selector: 'app-account',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.scss']
})
export class AccountComponent implements OnInit {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Declarations
  ////////////////////////////////////////////////////////////////////////////////////////////////

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


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(private _authService: AuthService,
              private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Form Search (New Account)
  ////////////////////////////////////////////////////////////////////////////////////////////////

  onSubmitForm(): void {
    this.isSpinnerActive = true;
    if(this.form.valid) {
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;
      this._authService.createAccount(email, password)
      .then((res: IAuthRes) => {
        this.isSpinnerActive = false;
        this._snackBar.open(res.message_ch);
      })
      .catch((error) => {
        this.isSpinnerActive = false;
      });
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Event functions to HTML
  ////////////////////////////////////////////////////////////////////////////////////////////////

  closeSnackBar() {
    this._snackBar.dismiss();
  }

  sendEmailValidation() {
    this.isSpinnerActive = true;
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;
    if(email !== '' && password !== '') {
      this._authService.sendEmailValidationLink(email, password)
      .then((res: IAuthRes) => {
        this.isSpinnerActive = false;
        this._snackBar.open(res.message_ch);
      })
      .catch((error) => {
        this.isSpinnerActive = false;
      });
    } else {
      this._snackBar.open('E-Mail und Passwortfeld ausfüllen');
    }
  }



  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Asynchron functions
  ////////////////////////////////////////////////////////////////////////////////////////////////


}
