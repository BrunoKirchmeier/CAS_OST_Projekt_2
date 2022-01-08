import { Injectable } from '@angular/core';
import { Firestore, query, collection, where, QuerySnapshot } from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { IAccountUser } from 'src/app/account/shared/services/account.service';
import { IOffer } from 'src/app/offer/shared/services/offer.service';
import { AuthService } from 'src/app/shared/services/auth.services';
import { DatabaseService } from 'src/app/shared/services/database.service';

@Injectable({
  providedIn: 'root'
})

export class BasketService {

  private _currentUser: any = null;
  private _basketCollection: string = 'basket';

  constructor(private _authService: AuthService,
              private _dbExt: DatabaseService,
              private _db: Firestore) {
    this._currentUser = JSON.parse(this._authService.currentUser);
  }

  async getBasket(): Promise<{[id: string]: IBasket[]}> {
    let basket: Array<IBasket> = [];
    let q = query(collection(this._db, this._basketCollection),
                  where('buyerUid', '==', this._currentUser.uid));
    await this._dbExt.readDoc<IBasket>(q)
      .then((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach(doc => {
          let item = doc as any;
          basket.push(item);
        })
      })
    let dictionary: {[id: string]: IBasket[]} = {};
    for(let i=0; i < basket.length; i++) {
      let obj: IBasket = basket[i];
      if(obj.providerDetail?.lastName == '' &&
         obj.providerDetail?.firstName == '') {
          obj.providerDetail.lastName = 'Anonym';
      }
      if(dictionary.hasOwnProperty(obj.providerDetail.uid)) {
        dictionary[obj.providerDetail.uid].push(obj);
      } else {
        dictionary[obj.providerDetail.uid] = [];
        dictionary[obj.providerDetail.uid].push(obj);
      }
    };
    return new Promise((resolve) => {
      resolve(dictionary);
    });
  }

  async deleteItem(id: string): Promise<boolean> {
    let q = query(collection(this._db, this._basketCollection),
                  where('_id', '==', id));
    await this._dbExt.deleteDoc<IOffer>(q);
    return new Promise((resolve) => {
      resolve(true);
    });
  }

}
export interface IBasket {
  _id: string;
  offerId: string;
  buyerUid: string;
  quantity: number;
  offerDetail: IOffer;
  providerDetail: IAccountUser;
}
