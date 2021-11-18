import { Injectable } from '@angular/core';
import { Firestore, query, collection, where, QuerySnapshot } from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { AuthService } from '../../../shared/services/auth.services';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  private _subscriptions: Subscription[] = [];
  private _userCollection: string = 'users';

  constructor(private _authService: AuthService,
              private _dbExt: DatabaseService,
              private _db: Firestore) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  async getUser(): Promise<any> {
    let success: boolean = true;
    let accountData: IAccountUser;
    let err: any;
    let activUser: any = {};
    try {
      activUser = JSON.parse(this._authService.currentUser);
    } catch (error) {}
    let q = query(collection(this._db, this._userCollection),
                  where('email', '==', activUser.email));
    await this._dbExt.readDoc<IAccountUser>(q)
      .then((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach(doc => {
          accountData = doc as any;
        })
      })
      .catch((error) => {
        success = false;
        err = error;
      })
    if(success) {
      return new Promise((resolve) => {
        resolve(accountData);
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
  }


  async updateUser(user: IAccountUser): Promise<any> {
    let success: boolean = true;
    let err: any;
    let q = query(collection(this._db, this._userCollection),
                  where('email', '==', user.email));
    await this._dbExt.updateDoc<IAccountUser>(q, user)
    .catch((error) => {
      success = false;
      err = error;
    })
    if(success) {
      return new Promise((resolve) => {
        resolve(true);
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

  }





}

export interface IAccountUser {
  email: string;
  firstName: string | null;
  lastName: string | null;
  street: string | null;
  zip: number | null;
  city: string | null;
  country: string | null;
  phone: number | null;
  accountNumber: string | null;
}
