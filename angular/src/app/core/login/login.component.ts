import { ICurrentUser } from '../global';

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { getAuth, signInAnonymously, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail , signInWithEmailAndPassword, signOut } from "firebase/auth";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Declarations
  ////////////////////////////////////////////////////////////////////////////////////////////////

  public returnUrl: string = '';
  public form = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.required,
                                                   Validators.email])),
    // Passwort requirments:
    // - At least 8 characters in length
    // - Lowercase letters
    // - Uppercase letters
    password: new FormControl('', Validators.compose([Validators.required,
                                                      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]))
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////


  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Form Search (Login To Firestore)
  ////////////////////////////////////////////////////////////////////////////////////////////////

  login() : void {

    if (this.form.invalid) {
      return;
    }

    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      if(userCredential.user.emailVerified == true) {
        const currentUser: ICurrentUser = {email: email, token: ''}


        localStorage.setItem('currentUser', JSON.stringify(currentUser));

      } else {
        this._snackBar.open('Der Account wurde noch nicht best&auml;tigt. Bitte pr&uuml;fen Sie Ihren Posteingang');
      }

      // If is
      // userCredential.user.emailVerified = true, dann Token in seesion speichern


      console.log(userCredential);
    })
    .catch((error) => {
      this._snackBar.open('Fehlerhafte Anmeldung. Bitte versuchen Sie es erneut');
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Event functions
  ////////////////////////////////////////////////////////////////////////////////////////////////

  closeSnackBar() {
    this._snackBar.dismiss();
  }


    // this.firestore.
    // this.fireStoreAuth.
    // this.fireStoreAuth.setPersistence.
    // this.firestore.app.options.




    // https://modularfirebase.web.app/common-use-cases/authentication/



}
