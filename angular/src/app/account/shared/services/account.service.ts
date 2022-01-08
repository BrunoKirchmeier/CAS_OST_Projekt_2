import { Injectable } from '@angular/core';
import { Firestore, query, collection, where, QuerySnapshot } from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { IBasket } from 'src/app/basket/shared/basket.service ';
import { DatabaseService } from 'src/app/shared/services/database.service';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  private _userCollection: string = 'users';
  private _basketCollection: string = 'basket';

  constructor(private _dbExt: DatabaseService,
              private _db: Firestore) {}

  async getUsers(): Promise<IAccountUser[]> {
    let accountData: IAccountUser[] = [];
    let q = query(collection(this._db, this._userCollection))
    await this._dbExt.readDoc<any>(q)
      .then((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach(doc => {
            accountData.push(doc as any);
        })
      })
    return new Promise((resolve) => {
      resolve(accountData);
    });
  }

  async getUser(email: string): Promise<any> {
    let accountData: IAccountUser;
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
    // Also update Basket detail Data
    const basketData: any = {
      providerDetail: user
    }
    q = query(collection(this._db, this._basketCollection),
              where('providerDetail.uid', '==', user.uid));
    await this._dbExt.updateDoc<IBasket>(q, basketData);
    return new Promise((resolve) => {
      resolve(true);
    });
  }

}

export interface IAccountUser {
  _id: string;
  uid: string,
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  zip: string;
  city: string;
  countryIso: string;
  phonePrefix: string;
  phone: string;
  iban: string;
}
