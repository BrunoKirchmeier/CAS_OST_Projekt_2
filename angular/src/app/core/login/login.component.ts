import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, signInAnonymously, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail , signInWithEmailAndPassword, signOut } from "firebase/auth";

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
    email: new FormControl(''),
    password: new FormControl(''),
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////


  constructor(private router: Router) { }

  ngOnInit() {}


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Form Search (Login To Firestore)
  ////////////////////////////////////////////////////////////////////////////////////////////////

  onSubmitForm() : void {
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      // If is
      // userCredential.user.emailVerified = true, dann Token in seesion speichern


      console.log(userCredential);
    })
    .catch((error) => { console.log(error)});
  }



    // this.firestore.
    // this.fireStoreAuth.
    // this.fireStoreAuth.setPersistence.
    // this.firestore.app.options.




    // https://modularfirebase.web.app/common-use-cases/authentication/



}
