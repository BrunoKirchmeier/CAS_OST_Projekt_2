import { Injectable, OnDestroy } from '@angular/core';
import { Firestore, query, collection, where, QuerySnapshot } from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { AuthService } from '../../../shared/services/auth.services';

@Injectable({
  providedIn: 'root'
})

export class AccountService implements OnDestroy{

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

  async getUser(email: string): Promise<any> {
    let accountData: IAccountUser;
    let activUser: any = JSON.parse(this._authService.currentUser);
    let q = query(collection(this._db, this._userCollection),
                  where('email', '==', email));
    await this._dbExt.readDoc<IAccountUser>(q)
      .then((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach(doc => {
          accountData = doc as any;
        })
      })
    return new Promise((resolve) => {
      resolve(accountData);
    });
  }

  async updateUser(user: IAccountUser): Promise<any> {
    let q = query(collection(this._db, this._userCollection),
                  where('email', '==', user.email));
    await this._dbExt.updateDoc<IAccountUser>(q, user)
    return new Promise((resolve) => {
      resolve(true);
    });
  }





}

export interface IAccountUser {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  zip: string;
  city: string;
  countryIso: string;
  phone: string;
  iban: string;
}
