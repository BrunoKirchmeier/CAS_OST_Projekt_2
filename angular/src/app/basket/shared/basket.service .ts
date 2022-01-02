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
  private _userCollection: string = 'users';
  private _offersCollection: string = 'offers';
  private _basketCollection: string = 'basket';

  constructor(private _authService: AuthService,
              private _dbExt: DatabaseService,
              private _db: Firestore) {
    this._currentUser = JSON.parse(this._authService.currentUser);
  }

  async getBasket(): Promise<IBasket[]> {
    let basket: Array<IBasket> = [];
    let q = query(collection(this._db, this._basketCollection),
                  where('buyerUid', '==', this._currentUser?.uid ?? ''));
    await this._dbExt.readDoc<IBasket>(q)
      .then((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach(doc => {
          let item = doc as any;
          basket.push(item);
        })
      })
    for(let i=0; i < basket.length; i++) {
      let qOffer = query(collection(this._db, this._offersCollection),
                         where('_id', '==', basket[i].offerId));
      let offer: IOffer[] = await this._dbExt.readDoc<IOffer[]>(qOffer);


      let qProvider = query(collection(this._db, this._userCollection),
                            where('uid', '==', offer[0].providerUid));
      let provider: IAccountUser[] = await this._dbExt.readDoc<IAccountUser[]>(qProvider);

      basket[i].offerDetail = offer[0];
      basket[i].providerDetail = provider[0];
    };
    return new Promise((resolve) => {
      resolve(basket);
    });
  }

}

export interface IBasket {
  _id: string;
  offerId: string;
  buyerUid: string;
  quantity: number;
  offerDetail: IOffer | null;
  providerDetail: IAccountUser | null;
}

