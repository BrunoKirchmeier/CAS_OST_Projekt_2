import { Injectable } from '@angular/core';
import { getAuth,
         signInWithEmailAndPassword, signOut,
         createUserWithEmailAndPassword,
         sendEmailVerification,
         sendPasswordResetEmail } from "firebase/auth";
import { BehaviorSubject } from 'rxjs';
import { IAccountUser } from 'src/app/account/shared/services/account.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private _statesDict = {
      UNDEFINED: {
        code: 'UNDEFINED',
        message: ''},
      CREATE_SUCCESS: {
        code: 'CREATE_SUCCESS',
        message: 'Der Account wurde erfolgreich angelegt. Sie erhalten in kürze eine E-Mail zur Bestätigung des Kontos'},
      ALLREADY_CREATED: {
        code: 'ALLREADY_CREATED',
        message: 'Der Account ist bereits vorhanden'},
      UNDEFINED_USER: {
        code: 'UNDEFINED_USER',
        message: 'Ungültige Logindaten'},
      WRONG_PASSWORD: {
        code: 'WRONG_PASSWORD',
        message: 'Ungültige Logindaten'},
      UNVALID_EMAIL: {
        code: 'UNVALID_EMAIL',
        message: 'Ungültige Logindaten'},
      EMAIL_VALIDATION_NEEDED: {
        code: 'EMAIL_VALIDATION_NEEDED',
        message: 'Ihre E-Mail Adresse ist noch nicht verifiziert. Bitte bestätigen Sie den Validierungslink in Ihrem Postfach'},
      LOGIN_SUCCESS: {
        code: 'LOGIN_SUCCESS',
        message: 'Login erfolgreich'},
      EMAIL_VALIDATION_SUCCESS: {
        code: 'EMAIL_VALIDATION_SUCCESS',
        message: 'Der Bestätigungslink wurde erfolgreich versendet'},
      EMAIL_PW_RESET: {
        code: 'EMAIL_VALIDATION_SUCCESS',
        message: 'Sie erhalten in Kürze eine E-Mail mit einem Link zum ändern des Passworts.'},
  };
  private _response: IAuthState = {loginState: localStorage.getItem('currentUser') ? true : false,
                                   currentUser: localStorage.getItem('currentUser') ?? {},
                                   code: this._statesDict.UNDEFINED.code,
                                   messageText: this._statesDict.UNDEFINED.message};
  private _userCollection: string = 'users';

  public onChangeloggedInState$ = new BehaviorSubject<IAuthState>(this._response);

  get currentUser(): any {
    return localStorage.getItem('currentUser');
  }

  constructor(private _dbExt: DatabaseService) {}

  async createAccount(email: string, password: string): Promise<IAuthState> {
    const auth = getAuth();
    let success = false;
    await createUserWithEmailAndPassword(auth, email, password)
    .then((res) => {
      this._response.currentUser = res.user;
      success = true;
    })
    .catch((error) => {
      switch (error.code) {
        case 'auth/email-already-in-use':
          this._response.code = this._statesDict.ALLREADY_CREATED.code;
          this._response.messageText = this._statesDict.ALLREADY_CREATED.message;
          break;
        default:
          throw(error);
      }
    });
    if(success) {
      success = false;
      const user: IAccountUser = {
        _id: '',
        uid: this._response.currentUser.uid,
        email: this._response.currentUser.email,
        firstName: '',
        lastName: '',
        address: '',
        zip: '',
        city: '',
        countryIso: '',
        phone: '',
        iban: ''
      }
      await this._dbExt.createDoc<IAccountUser>(this._userCollection,
                                                user)
      .then(() => {
        success = true;
      })
    }
    if(success) {
      await sendEmailVerification(this._response.currentUser)
      .then(() => {
        this._response.code = this._statesDict.CREATE_SUCCESS.code;
        this._response.messageText = this._statesDict.CREATE_SUCCESS.message;
      })
    }
    return new Promise((resolve) => {
      resolve(this._response);
    });
  }

  async login(email: string, password: string): Promise<IAuthState> {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password)
    .then((res) => {
      if(res.user.emailVerified === true) {
        this._response.code = this._statesDict.LOGIN_SUCCESS.code;
        this._response.messageText = this._statesDict.LOGIN_SUCCESS.message;
        this._response.loginState = true;
        if(res.hasOwnProperty('user') &&
           res.user.hasOwnProperty('accessToken')) {
            localStorage.setItem('currentUser', JSON.stringify(res.user))
            this._response.currentUser = res.user;
        }
      } else {
        this._response.code = this._statesDict.EMAIL_VALIDATION_NEEDED.code;
        this._response.messageText = this._statesDict.EMAIL_VALIDATION_NEEDED.message;
      }
    })
    .catch((error) => {
      switch (error.code) {
        case 'auth/user-not-found':
          this._response.code = this._statesDict.UNDEFINED_USER.code;
          this._response.messageText = this._statesDict.UNDEFINED_USER.message;
          break;
        case 'auth/wrong-password':
          this._response.code = this._statesDict.WRONG_PASSWORD.code;
          this._response.messageText = this._statesDict.WRONG_PASSWORD.message;
          break;
        default:
          throw(error);
      }
    });
    return new Promise((resolve) => {
      this.onChangeloggedInState$.next(this._response);
      resolve(this._response);
    });
  }

  async sendEmailValidationLink(email: string, password: string): Promise<IAuthState> {
    const auth = getAuth();
    let success = false;
    await signInWithEmailAndPassword(auth, email, password)
    .then((res) => {
      this._response.currentUser = res.user;
      success = true;
    })
    .catch((error) => {
      switch (error.code) {
        case 'auth/user-not-found':
          this._response.code = this._statesDict.UNDEFINED_USER.code;
          this._response.messageText = this._statesDict.UNDEFINED_USER.message;
          break;
        case 'auth/invalid-email':
          this._response.code = this._statesDict.UNVALID_EMAIL.code;
          this._response.messageText = this._statesDict.UNVALID_EMAIL.message;
          break;
        case 'auth/wrong-password':
          this._response.code = this._statesDict.WRONG_PASSWORD.code;
          this._response.messageText = this._statesDict.WRONG_PASSWORD.message;
          break;
        default:
          throw(error);
      }
    });
    if(success) {
      await sendEmailVerification(this._response.currentUser)
      .then(() => {
        this._response.code = this._statesDict.EMAIL_VALIDATION_SUCCESS.code;
        this._response.messageText = this._statesDict.EMAIL_VALIDATION_SUCCESS.message;
      })
    }
    return new Promise((resolve) => {
      this.onChangeloggedInState$.next(this._response);
      resolve(this._response);
    });
  }

  async sendPasswordResetEmail(email: string): Promise<IAuthState> {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email)
    .then(() => {
      this._response.code = this._statesDict.EMAIL_PW_RESET.code;
      this._response.messageText = this._statesDict.EMAIL_PW_RESET.message;
    })
    return new Promise((resolve) => {
      resolve(this._response);
    });
  }

  async logout(): Promise<IAuthState> {
    const auth = getAuth();
    await signOut(auth)
    localStorage.removeItem('currentUser');
    this._response.loginState = false;
    this._response.code = this._statesDict.EMAIL_VALIDATION_SUCCESS.code;
    this._response.messageText = this._statesDict.EMAIL_VALIDATION_SUCCESS.message;
    this.onChangeloggedInState$.next(this._response);
    return new Promise((resolve) => {
      resolve(this._response);
    });
  }

}

export interface IAuthState {
  loginState: boolean;
  currentUser: any;
  code: string;
  messageText: string;
}
