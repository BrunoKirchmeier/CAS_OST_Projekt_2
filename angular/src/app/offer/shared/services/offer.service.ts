import { Injectable } from '@angular/core';
import { Firestore, query, collection, where, QuerySnapshot, Timestamp } from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { AuthService } from '../../../shared/services/auth.services';

@Injectable({
  providedIn: 'root'
})

export class OfferService {

  private _currentUser: any = null;
  private _offersCollection: string = 'offers';

  constructor(private _authService: AuthService,
              private _dbExt: DatabaseService,
              private _db: Firestore) {
    this._currentUser = JSON.parse(this._authService.currentUser);
  }

  async createOffer(data: any): Promise<any> {
    const offer: IOffer = {
      _id: null,
      cardName: data.cardName,
      providerUid: this._currentUser.uid,
      providerEmail: this._currentUser.email,
      buyerUid: null,
      buyerEmail: null,
      unitPrice: data.unitPrice,
      quantity: data.quantity,
      deliveryMode: data.deliveryMode,
      paymentMode: data.paymentMode,
      additionInfo: data.additionInfo,
      creationDate : Timestamp.now(),
      saleDate : null};
    await this._dbExt.createDoc<IOffer>(this._offersCollection,
                                        offer)
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  async getMyOffers(): Promise<IOffer[]> {
    let offers: Array<IOffer>;
    let q = query(collection(this._db, this._offersCollection),
                  where('providerUid', '==', this._currentUser.uid));
    await this._dbExt.readDoc<IOffer>(q)
      .then((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach(doc => {
          let offer = doc as any;
          offers.push(offer);
        })
      })
    return new Promise((resolve) => {
      resolve(offers);
    });
  }

  getDeliveryModes() {
    const options: Array<IDeliveryModes> = [
      {name: 'collection', description: 'Abholung'},
      {name: 'shipping', description: 'Versand'}
    ]
    return options;
  }

  getPaymentModes() {
    const options: Array<IPaymentModes> = [
      {name: 'transfer', description: 'Kontoüberweisung'}
    ]
    return options;
  }

}
export interface IOffer {
  _id: string | null;
  cardName: string;
  providerUid: string;
  providerEmail: string ;
  buyerUid: string | null;
  buyerEmail: string | null;
  unitPrice: number;
  quantity: number;
  deliveryMode: string;
  paymentMode: string;
  additionInfo: string | null;
  creationDate : Timestamp;
  saleDate : Timestamp | null;
}
export interface IDeliveryModes {
  name: string;
  description: string;
}

export interface IPaymentModes {
  name: string;
  description: string;
}
