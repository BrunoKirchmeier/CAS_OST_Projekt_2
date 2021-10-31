import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';;
import { getAuth, signInAnonymously, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail , signInWithEmailAndPassword, signOut } from "firebase/auth";
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
    passwordConfirm: new FormControl('', CompareValidator('password'))
    },
  )


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(private router: Router,
              private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Form Search (New Account)
  ////////////////////////////////////////////////////////////////////////////////////////////////

  onSubmitForm(): void {
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const auth = getAuth();
      sendEmailVerification(userCredential.user)
      .then((response) => {
        this._snackBar.open('Der Account wurde erfolgreich angelegt. Sie erhalten in kürze eine E-Mail zur Bestätigung des Kontos.');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        let errorMessage: string = '';
        switch (error.code) {
          case "":
            errorMessage = "";
            break;
          default:
            errorMessage = "Es ist ein unbekannter Fehler aufgetaucht. Fehlercode: " + error.code;
        }
        this._snackBar.open(errorMessage);
      });
    })
    .catch((error) => {
      let errorMessage: string = '';
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Das Konto mit dieser E-Mail Adresse ist bereits angelegt";
          break;
        default:
          errorMessage = "Es ist ein unbekannter Fehler aufgetaucht. Fehlercode: " + error.code;
      }
      this._snackBar.open(errorMessage);
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Event functions
  ////////////////////////////////////////////////////////////////////////////////////////////////

  closeSnackBar() {
    this._snackBar.dismiss();
  }



    // https://modularfirebase.web.app/common-use-cases/authentication/


}
