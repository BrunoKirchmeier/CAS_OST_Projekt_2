import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';;
import { getAuth, signInAnonymously, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail , signInWithEmailAndPassword, signOut } from "firebase/auth";

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
    email: new FormControl(''),
    password: new FormControl(''),
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////


  constructor(private router: Router) { }

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
        // Email verification sent!
        // ...
        console.log(response)
      })
      .catch((error) => { console.log(error) });
    })
    .catch((error) => { console.log(error) });
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Event functions
  ////////////////////////////////////////////////////////////////////////////////////////////////





    // https://modularfirebase.web.app/common-use-cases/authentication/




}
