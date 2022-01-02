import { Injectable } from '@angular/core';
import { Firestore, query, collection, where, QuerySnapshot, Timestamp } from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { Subject } from 'rxjs';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { ICardDetails } from 'src/app/shared/services/scryfallApi.service';
import { AuthService } from '../../../shared/services/auth.services';

@Injectable({
  providedIn: 'root'
})

export class OfferService {

  private _currentUser: any = null;
  private _offersCollection: string = 'offers';

  public onChangeOwnerOffer$: Subject<IOffer[]> = new Subject<IOffer[]>();

  constructor(private _authService: AuthService,
              private _dbExt: DatabaseService,
              private _db: Firestore) {
    this._currentUser = JSON.parse(this._authService.currentUser);
    this.init();
  }

  async init() {
    let offers: IOffer[] = await this.getMyOffers();
    this.onChangeOwnerOffer$.next(offers);
  }

  async createOffer(data: any): Promise<any> {
    // Create the Offer in the DB
    let cardColors: string[] = data.cardDetails?.cardColors === undefined ||
                               data.cardDetails?.cardColors === null ||
                               data.cardDetails?.cardColors.length === 0
                             ? ['colorless']
                             : data.cardDetails?.cardColors;
    const offer: IOffer = {
      _id: '',
      cardName: data.cardName,
      cardDetails: {
        cardId: data.cardDetails?.cardId ?? '',
        cardName: data.cardDetails?.cardName ?? '',
        cardText: data.cardDetails?.cardText ?? '',
        cardImageUri: data.cardDetails?.cardImageUri ?? '',
        manaCost: data.cardDetails?.manaCost ?? '',
        cardLanguageIso: data.cardDetails?.cardLanguageIso ?? '',
        cardTypeLine: data.cardDetails?.cardTypeLine ?? '',
        cardTypesMain: data.cardDetails?.cardTypesMain ?? [],
        cardTypesSecond: data.cardDetails?.cardTypesSecond ?? [],
        cardColors: cardColors,
        cardEditionCode: data.cardDetails?.cardEditionCode ?? '',
        cardEditionName: data.cardDetails?.cardEditionName ?? '',
      },
      providerUid: this._currentUser.uid,
      providerEmail: this._currentUser.email,
      cardPrice: data.cardPrice,
      quantity: data.quantity,
      deliveryMode: data.deliveryMode,
      paymentMode: data.paymentMode,
      additionInfo: data.additionInfo,
      creationDate : Timestamp.now()
    };
    const offerId = await this._dbExt.createDoc<IOffer>(this._offersCollection,
                                                        offer)
    let offers: IOffer[] = await this.getMyOffers();
    this.onChangeOwnerOffer$.next(offers);
    return new Promise((resolve) => {
      resolve(offerId);
    });
  }

  async getMyOffers(): Promise<IOffer[]> {
    let offers: Array<IOffer> = [];
    let q = query(collection(this._db, this._offersCollection),
                  where('providerUid', '==', this._currentUser?.uid ?? ''));
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

  async getOffer(id: string): Promise<IOffer> {
    let offer: any;
    let q = query(collection(this._db, this._offersCollection),
                  where('_id', '==', id));
    await this._dbExt.readDoc<IOffer>(q)
      .then((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach(doc => {
          offer = doc as any;
        })
      })
    return new Promise((resolve) => {
      resolve(offer);
    });
  }

  async updateOffer(id: string, data: any): Promise<boolean> {
    let q = query(collection(this._db, this._offersCollection),
                  where('_id', '==', id));
    await this._dbExt.updateDoc<IOffer>(q, data);
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  async deleteOffer(id: string): Promise<boolean> {
    let q = query(collection(this._db, this._offersCollection),
                  where('_id', '==', id));
    await this._dbExt.deleteDoc<IOffer>(q);
    let offers: IOffer[] = await this.getMyOffers();
    this.onChangeOwnerOffer$.next(offers);
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  getDeliveryModes() {
    const options: Array<IDeliveryMode> = [
      {name: 'collection', description: 'Abholung'},
      {name: 'shipping', description: 'Versand'}
    ]
    return options;
  }

  getPaymentModes() {
    const options: Array<IPaymentMode> = [
      {name: 'transfer', description: 'Kontoüberweisung'}
    ]
    return options;
  }

}
export interface IOffer {
  _id: string;
  cardName: string;
  cardDetails: ICardDetails | null,
  providerUid: string;
  providerEmail: string ;
  cardPrice: number;
  quantity: number;
  deliveryMode: string;
  paymentMode: string;
  additionInfo: string | null;
  creationDate : Timestamp;
}
export interface IDeliveryMode {
  name: string;
  description: string;
}

export interface IPaymentMode {
  name: string;
  description: string;
}
