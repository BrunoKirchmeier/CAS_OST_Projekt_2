import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { getAuth, signInAnonymously, createUserWithEmailAndPassword,
         sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Declarations
  ////////////////////////////////////////////////////////////////////////////////////////////////

  private _statesDict = {
      UNDEFINED: {
        state: 0,
        message_ch: ''},
      CREATE_SUCCESS_CH: {
        state: 1,
        message_ch: 'Der Account wurde erfolgreich angelegt. Sie erhalten in kürze eine E-Mail zur Bestätigung des Kontos'},
      ALLREADY_CREATED_CH: {
        state: 2,
        message_ch: 'Der Account ist bereits vorhanden'},
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(private db: Firestore,
              private dbAuth: Auth) {}

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Firebase Function Calls
  ////////////////////////////////////////////////////////////////////////////////////////////////

  /*
    Function: createAccount
    New Account in Firebase with Verifications E-Mail
  */
  async createAccount(email: string, password: string): Promise<IAuthRes> {
    const auth = getAuth();
    let ret: IAuthRes = { state: this._statesDict.UNDEFINED.state,
                          errorCode: '',
                          errorMessage: '',
                          message_ch: this._statesDict.UNDEFINED.message_ch };
    await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const auth = getAuth();
      sendEmailVerification(userCredential.user)
      .then((res) => {
        ret.state = this._statesDict.CREATE_SUCCESS_CH.state;
        ret.message_ch = this._statesDict.CREATE_SUCCESS_CH.message_ch;
      })
      .catch((error) => {
        ret.errorCode = error.code;
        ret.errorMessage = error.message;
        switch (error.code) {
          case '':
            ret.state = this._statesDict.UNDEFINED.state;
            ret.message_ch = this._statesDict.UNDEFINED.message_ch;
            break;
          default:
            ret.state = this._statesDict.UNDEFINED.state;
            ret.message_ch = this._statesDict.UNDEFINED.message_ch;
        }
      });
    })
    .catch((error) => {
      ret.errorCode = error.code;
      ret.errorMessage = error.message;
      switch (error.code) {
        case 'auth/email-already-in-use':
          ret.state = this._statesDict.ALLREADY_CREATED_CH.state;
          ret.message_ch = this._statesDict.ALLREADY_CREATED_CH.message_ch;
          break;
        default:
          ret.state = this._statesDict.UNDEFINED.state;
          ret.message_ch = this._statesDict.UNDEFINED.message_ch;
      }
    });
    return new Promise((resolve, reject) => {
      resolve(ret);
    });
  }







}





////////////////////////////////////////////////////////////////////////////////////////////////
// Synchron Functions
////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////
// Interfaces
////////////////////////////////////////////////////////////////////////////////////////////////

/*
  Datatyp: Authentification Response
*/
export interface IAuthRes {
  state: number;
  errorCode: string;
  errorMessage: string;
  message_ch: string;
}
