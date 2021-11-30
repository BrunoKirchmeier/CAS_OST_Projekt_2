import { Injectable } from '@angular/core';
import { Firestore, query, collection, where, QuerySnapshot, Timestamp } from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { Subject } from 'rxjs';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { ICardDetails } from 'src/app/shared/services/scryfallApi.service';
import { AuthService } from '../../../shared/services/auth.services';
import { OfferCreateComponent } from '../../offer-create/offer-create.component';

@Injectable({
  providedIn: 'root'
})

export class OfferService {

  private _currentUser: any = null;
  private _offersCollection: string = 'offers';
  private _cardDetailCollection: string = 'cardDetails';

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
    const offer: IOffer = {
      _id: null,
      cardName: data.cardName,
      cardDetails: null,
      providerUid: this._currentUser.uid,
      providerEmail: this._currentUser.email,
      buyerUid: null,
      buyerEmail: null,
      priceTotal: data.priceTotal,
      quantity: data.quantity,
      deliveryMode: data.deliveryMode,
      paymentMode: data.paymentMode,
      additionInfo: data.additionInfo,
      creationDate : Timestamp.now(),
      saleDate : null
    };
    await this._dbExt.createDoc<IOffer>(this._offersCollection,
                                        offer)
    const cardDetail: ICardDetails = {
      _id: '',
      cardName: data.cardDetails?.cardName,
      cardText: data.cardDetails?.cardText,
      cardImageUri: data.cardDetails?.cardImageUri,
      manaCost: data.cardDetails?.manaCost,
      cardLanguageIso: data.cardDetails?.cardLanguageIso
    };
    await this._dbExt.createDoc<ICardDetails>(this._cardDetailCollection,
                                              cardDetail)
    let offers: IOffer[] = await this.getMyOffers();
    this.onChangeOwnerOffer$.next(offers);
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  async getMyOffers(): Promise<IOffer[]> {
    let offers: Array<IOffer> = [];
    let offersExtended: Array<IOffer> = [];
    let q = query(collection(this._db, this._offersCollection),
                  where('providerUid', '==', this._currentUser.uid));
    await this._dbExt.readDoc<IOffer>(q)
      .then((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach(doc => {
          let offer = doc as any;
          offers.push(offer);
        })
      })
      for (let i=0; i < offers.length; i++) {
        let q = query(collection(this._db, this._cardDetailCollection),
                      where('cardName', '==', offers[i].cardName));
        let cardDetails = await this._dbExt.readDoc<IOffer>(q)
        offersExtended[i] = offers[i];
        offersExtended[i].cardDetails = cardDetails[0];
      }
    return new Promise((resolve) => {
      resolve(offersExtended);
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
      let q2 = query(collection(this._db, this._cardDetailCollection),
                     where('cardName', '==', offer.cardName));
      let cardDetails = await this._dbExt.readDoc<IOffer>(q2)
      offer.cardDetails = cardDetails;
    return new Promise((resolve) => {
      resolve(offer);
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
  cardDetails: ICardDetails | null,
  providerUid: string;
  providerEmail: string ;
  buyerUid: string | null;
  buyerEmail: string | null;
  priceTotal: number;
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
