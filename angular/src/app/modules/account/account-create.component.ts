import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';;
import { getAuth, signInAnonymously, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail , signInWithEmailAndPassword, signOut } from "firebase/auth";
import { AuthService, IAuthRes } from 'src/app/core/services/auth.services';
import { __await } from 'tslib';
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


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(private _router: Router,
              private _authService: AuthService,
              private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Form Search (New Account)
  ////////////////////////////////////////////////////////////////////////////////////////////////

  onSubmitForm(): void {

    if(this.form.valid) {
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;
      this._authService.createAccount(email, password)
      .then((res: IAuthRes) => {
        this._snackBar.open(res.message_ch);
      })
      .catch((error) => {
        console.log(error);
      });
    }


    // const res: IAuthRes = this._authService.createAccount(email, password);



    // this._snackBar.open(res.message_ch);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Event functions
  ////////////////////////////////////////////////////////////////////////////////////////////////

  closeSnackBar() {
    this._snackBar.dismiss();
  }



    // https://modularfirebase.web.app/common-use-cases/authentication/


}
