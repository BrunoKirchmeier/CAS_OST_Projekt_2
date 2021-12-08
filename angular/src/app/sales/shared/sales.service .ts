import { Injectable } from '@angular/core';
import { Firestore, query, collection, where, QuerySnapshot, Timestamp } from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { IOffer } from 'src/app/offer/shared/services/offer.service';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { ApiScryfallService, ICardDetails } from 'src/app/shared/services/scryfallApi.service';
import { AuthService } from '../../shared/services/auth.services';

@Injectable({
  providedIn: 'root'
})

export class SalesService {

  private _offersCollection: string = 'offers';
  private _salesCollection: string = 'sales';

  constructor(private _dbExt: DatabaseService,
              private _db: Firestore,
              private _scryfall: ApiScryfallService) {
  }

  async searchOffersByCardText(value: string): Promise<IOffer[]> {
    let offers: IOffer[] = [];
    let dbMatches: IOffer[] = [];
    let scryfallMatches = await this._scryfall.cardTextSearch(value);
    let q = query(collection(this._db, this._offersCollection));
    await this._dbExt.readDoc<IOffer>(q)
      .then((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach(doc => {
          let offer = doc as any;
          dbMatches.push(offer);
        })
      })
    offers = dbMatches.filter(o1 => !scryfallMatches.some(o2 => o1.cardName === o2.name));
    return new Promise((resolve) => {
      resolve(offers);
    });
  }




}




/*

  async searchOffersByCardText(value: string): Promise<IOffer[]> {
    let offers: IOffer[] = []
    const scryfallMatches = await this._scryfall.cardTextSearch(value);
    for (let i = 0; i < scryfallMatches.length; i++) {
      let offer: IOffer;
      let q = query(collection(this._db, this._offersCollection),
                    where('cardName', '==', scryfallMatches[i].name.replace('"', '')));
      await this._dbExt.readDoc<IOffer>(q)
        .then((snapshot: QuerySnapshot<DocumentData>) => {
          snapshot.forEach(doc => {
            offer = doc as any;
            offers.push(offer);
          })
        })
    }
    return new Promise((resolve) => {
      resolve(offers);
    });
  }


*/




export interface ISales {
  _id: string | null;
  _offerId: string;
  cardName: string;
  cardDetails: ICardDetails,
  providerUid: string;
  providerEmail: string ;
  buyerUid: string;
  buyerEmail: string;
  priceTotal: number;
  quantity: number;
  deliveryMode: string;
  paymentMode: string;
  additionInfo: string | null;
  creationDate : Timestamp;
  saleDate : Timestamp;
}
