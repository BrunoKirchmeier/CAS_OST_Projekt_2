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
  private _filterCollection: string = 'offerFilters';

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
    const offer: IOffer = {
      _id: null,
      cardName: data.cardName,
      cardDetails: {
        cardName: data.cardDetails?.cardName ?? '',
        cardText: data.cardDetails?.cardText ?? '',
        cardImageUri: data.cardDetails?.cardImageUri ?? '',
        manaCost: data.cardDetails?.manaCost ?? '',
        cardLanguageIso: data.cardDetails?.cardLanguageIso ?? '',
        cardTypes: data.cardDetails?.cardTypes ?? [],
        cardColors: data.cardDetails?.cardColors ?? [],
        cardEditionCode: data.cardDetails?.cardEditionCode ?? '',
        cardEditionName: data.cardDetails?.cardEditionName ?? '',
      },
      providerUid: this._currentUser.uid,
      providerEmail: this._currentUser.email,
      priceTotal: data.priceTotal,
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
    // Create a Table for Joing filtering Values by showing Offers
    data.cardDetails?.cardTypes.forEach((type: string) => {
      const filter: any = {
        filterType: 'cardTypes',
        value: type,
        offerId: offerId,
        cardName: data.cardDetails?.cardName ?? ''
      }
      this._dbExt.createDoc<any>(this._filterCollection,
                                    filter)
    });
    // Create a Table for Joing filtering Values by showing Offers
    data.cardDetails?.cardColors.forEach((color: string) => {
      const filter: any = {
        filterType: 'cardColors',
        value: color,
        offerId: offerId,
        cardName: data.cardDetails?.cardName ?? ''
      }
      this._dbExt.createDoc<any>(this._filterCollection,
                                    filter)
    });
    return new Promise((resolve) => {
      resolve(offerId);
    });
  }

  async getMyOffers(): Promise<IOffer[]> {
    let offers: Array<IOffer> = [];
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
  priceTotal: number;
  quantity: number;
  deliveryMode: string;
  paymentMode: string;
  additionInfo: string | null;
  creationDate : Timestamp;
}
export interface IDeliveryModes {
  name: string;
  description: string;
}

export interface IPaymentModes {
  name: string;
  description: string;
}
