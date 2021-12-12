import { Injectable } from '@angular/core';
import { Firestore, query, collection, where, QuerySnapshot, Timestamp } from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { IOffer } from 'src/app/offer/shared/services/offer.service';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { ApiScryfallService, ICardDetails, IFilter, IFilterOption } from 'src/app/shared/services/scryfallApi.service';

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

  async getOffersByFilter(filter: IFilter): Promise<IOffer[]> {
    let offers: IOffer[] = [];
    let dbMatches: IOffer[] = [];
    let scryfallMatches = await this._scryfall.getCardsByFilter(filter);
    let q = query(collection(this._db, this._offersCollection));
    await this._dbExt.readDoc<IOffer>(q)
      .then((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach(doc => {
          let offer = doc as any;
          dbMatches.push(offer);
        })
      })
    offers = dbMatches.filter(o1 => scryfallMatches.some(o2 => o1.cardName === o2.name));
    return new Promise((resolve) => {
      resolve(offers);
    });
  }

  async getAllOffers(): Promise<IOffer[]> {
    let offers: IOffer[] = [];
    let q = query(collection(this._db, this._offersCollection));
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

  async getAllUsedFilterValues(): Promise<IFilter> {
    let filter: IFilter = {
      cardTypes: [],
      cardColors: [],
      cardEditions: [],
      cardNamesInOffers: [],
      cardNameSearch: null,
      cardTextSearch: null
    }
    let q = query(collection(this._db, this._offersCollection));
    await this._dbExt.readDoc<IOffer>(q)
      .then((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach((doc: any) => {
          doc.cardDetails?.cardColors.forEach((color: any) => {
            let option: IFilterOption = {
              code: color,
              description: '',
              state: false
            }
            if(color === 'W') { option.description = 'Weiss'};
            if(color === 'U') { option.description = 'Blau'};
            if(color === 'B') { option.description = 'Schwarz'};
            if(color === 'R') { option.description = 'Rot'};
            if(color === 'G') { option.description = 'Grün'};
            let result = filter.cardColors.find(x => x.code === color);
            if(result === undefined) {
              filter.cardColors.push(option);
            }
          });
          let result = filter.cardEditions.find(x => x.code === doc.cardDetails?.cardEditionCode);
          if(result === undefined) {
            let option: IFilterOption = {
              code: doc.cardDetails?.cardEditionCode,
              description: doc.cardDetails?.cardEditionName,
              state: false
            }
            filter.cardEditions.push(option);
          }
          doc.cardDetails?.cardType.split(' — ')
            .forEach((types: string) => {
              types.split(' ').forEach((type: string) => {
                let option: IFilterOption = {
                  code: type,
                  description: type,
                  state: false
                }
                let result = filter.cardTypes.find(x => x.code === type);
                if(result === undefined) {
                  filter.cardTypes.push(option);
                }
              })
            })
          let exist = filter.cardNamesInOffers.includes(doc.cardDetails?.cardName);
          if(exist === false) {
            filter.cardNamesInOffers.push(doc.cardDetails?.cardName);
          }
        })
      })
    return new Promise((resolve) => {
      resolve(filter);
    });
  }

}

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

export interface IDialogData {
  results: IOffer[],
  filter: IFilter | null,
}
