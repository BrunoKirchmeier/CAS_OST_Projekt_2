import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { getAuth, signInAnonymously, createUserWithEmailAndPassword,
         sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Observable, BehaviorSubject } from 'rxjs';

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
      UNDEFINED_USER_CH: {
        state: 3,
        message_ch: 'Ungültige Logindaten'},
      WRONG_PASSWORD_CH: {
        state: 4,
        message_ch: 'Ungültige Logindaten'},
      UNVALID_EMAIL_CH: {
        state: 3,
        message_ch: 'Ungültige Logindaten'},
      EMAIL_VALIDATION_NEEDED_CH: {
        state: 5,
        message_ch: 'Ihre E-Mail Adresse ist noch nicht verifiziert. Bitte bestätigen Sie den Validierungslink in Ihrem Postfach'},
      LOGIN_SUCCESS_CH: {
        state: 6,
        message_ch: 'Login erfolgreich'},
      EMAIL_VALIDATION_SUCCESS_CH: {
        state: 7,
        message_ch: 'Der Bestätigungslink wurde erfolgreich versendet'},
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
    let userCredential: any;
    let ret: IAuthRes = { state: this._statesDict.UNDEFINED.state,
                          errorCode: '',
                          errorMessage: '',
                          message_ch: this._statesDict.UNDEFINED.message_ch ,
                          accessToken: '',
                          refreshToken: '',
                          tokenExpireIn: 0 };
    await createUserWithEmailAndPassword(auth, email, password)
    .then((res) => {
      userCredential = res;
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

    await sendEmailVerification(userCredential.user)
    .then(() => {
      ret.state = this._statesDict.CREATE_SUCCESS_CH.state;
      ret.message_ch = this._statesDict.CREATE_SUCCESS_CH.message_ch;
    })

    return new Promise((resolve, reject) => {
      resolve(ret);
    });
  }

  /*
    Function: Login
    Login to Firebase
  */
  async login(email: string, password: string): Promise<IAuthRes> {
    const auth = getAuth();
    let ret: IAuthRes = { state: this._statesDict.UNDEFINED.state,
                          errorCode: '',
                          errorMessage: '',
                          message_ch: this._statesDict.UNDEFINED.message_ch,
                          accessToken: '',
                          refreshToken: '',
                          tokenExpireIn: 0 };
    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      if(userCredential.user.emailVerified === true) {
        ret.state = this._statesDict.LOGIN_SUCCESS_CH.state;
        ret.message_ch = this._statesDict.LOGIN_SUCCESS_CH.message_ch;

    /*     ret.accessToken = userCredential.
        ret.refreshToken = userCredential.user
        ret.tokenExpireIn = userCredential.user

        local storage token setzen


        */
      } else {
        ret.state = this._statesDict.EMAIL_VALIDATION_NEEDED_CH.state;
        ret.message_ch = this._statesDict.EMAIL_VALIDATION_NEEDED_CH.message_ch;
      }
    })
    .catch((error) => {
      ret.errorCode = error.code;
      ret.errorMessage = error.message;
      switch (error.code) {
        case 'auth/user-not-found':
          ret.state = this._statesDict.UNDEFINED_USER_CH.state;
          ret.message_ch = this._statesDict.UNDEFINED_USER_CH.message_ch;
          break;
        case 'auth/wrong-password':
          ret.state = this._statesDict.WRONG_PASSWORD_CH.state;
          ret.message_ch = this._statesDict.WRONG_PASSWORD_CH.message_ch;
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

  /*
    Function: send Email validation Link
    New Account in Firebase with Verifications E-Mail
  */
  async sendEmailValidationLink(email: string, password: string): Promise<IAuthRes> {
    const auth = getAuth();
    let userCredential: any;
    let ret: IAuthRes = { state: this._statesDict.UNDEFINED.state,
                          errorCode: '',
                          errorMessage: '',
                          message_ch: this._statesDict.UNDEFINED.message_ch,
                          accessToken: '',
                          refreshToken: '',
                          tokenExpireIn: 0 }

    await signInWithEmailAndPassword(auth, email, password)
    .then((res) => {
      userCredential = res;
    })
    .catch((error) => {
      ret.errorCode = error.code;
      ret.errorMessage = error.message;
      switch (error.code) {
        case 'auth/user-not-found':
          ret.state = this._statesDict.UNDEFINED_USER_CH.state;
          ret.message_ch = this._statesDict.UNDEFINED_USER_CH.message_ch;
          break;
        case 'auth/invalid-email':
          ret.state = this._statesDict.UNVALID_EMAIL_CH.state;
          ret.message_ch = this._statesDict.UNVALID_EMAIL_CH.message_ch;
          break;
        case 'auth/wrong-password':
          ret.state = this._statesDict.WRONG_PASSWORD_CH.state;
          ret.message_ch = this._statesDict.WRONG_PASSWORD_CH.message_ch;
          break;
        default:
          ret.state = this._statesDict.UNDEFINED.state;
          ret.message_ch = this._statesDict.UNDEFINED.message_ch;
      }
    });

    await sendEmailVerification(userCredential.user)
    .then(() => {
      ret.state = this._statesDict.EMAIL_VALIDATION_SUCCESS_CH.state;
      ret.message_ch = this._statesDict.EMAIL_VALIDATION_SUCCESS_CH.message_ch;
    })

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
  accessToken: string;
  refreshToken: string;
  tokenExpireIn: number;
}




// https://stackoverflow.com/questions/37841721/wait-for-multiple-promises-to-finish
