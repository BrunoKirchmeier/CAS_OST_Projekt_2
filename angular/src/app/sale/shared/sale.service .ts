import { Injectable } from '@angular/core';
import { Firestore, query, collection, where, QuerySnapshot } from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { IBasketData } from 'src/app/basket/shared/basket.service ';
import { IOffer } from 'src/app/offer/shared/services/offer.service';
import { AuthService } from 'src/app/shared/services/auth.services';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { IFilter, IFilterOption } from 'src/app/shared/services/scryfallApi.service';

@Injectable({
  providedIn: 'root'
})

export class SaleService {

  private _currentUser: any = '';
  private _currentUserUid: string = '';
  private _offersCollection: string = 'offers';
  private _basketCollection: string = 'basket';

  private _statesDict: { [id: string] : IResponse; } = {
    UNDEFINED: {
      success: false,
      code: 'UNDEFINED',
      message: '' },
    LOGIN_FAILED: {
      success: false,
      code: 'LOGIN_FAILED',
      message: 'Der Warenkorb kann nur im eingeloggten Zustand befüllt werden'},
    CREATE_SUCCESS: {
      success: true,
      code: 'CREATE_SUCCESS',
      message: 'Das Angebot wurde in den Warenkorb gelegt'},
  };

  constructor(private _authService: AuthService,
              private _dbExt: DatabaseService,
              private _db: Firestore) {
    this._currentUser = JSON.parse(this._authService.currentUser);
    this._currentUserUid = this._currentUser !== null &&
                           this._currentUser?.uid !== null
                         ? this._currentUser.uid
                         : '';

  }

  async getAllOffers(cardNameIsUnique: Boolean = true): Promise<IOffer[]> {
    let offers: IOffer[] = [];
    let q = query(collection(this._db, this._offersCollection),
                  where('providerUid', '!=', this._currentUserUid));
    await this._dbExt.readDoc<IOffer>(q)
      .then((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach(doc => {
          let offer = doc as any;
          if(cardNameIsUnique === false) {
            offers.push(offer);
          } else {
            const obj = offers.find(o2 => o2.cardName === offer.cardName );
            if(obj === undefined) {
              offers.push(offer);
            }
          }
        })
      })
    return new Promise((resolve) => {
      resolve(offers);
    });
  }

  async getOffersByCardName(cardName: string): Promise<IOffer[]> {
    let offers: IOffer[] = [];
    let q = query(collection(this._db, this._offersCollection),
                  where('cardName', '==', cardName));
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
    }
    let q = query(collection(this._db, this._offersCollection),
                  where('providerUid', '!=', this._currentUserUid));
    await this._dbExt.readDoc<IOffer>(q)
      .then((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach((doc: any) => {
          // Colors - Colorless
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
            if(color === 'colorless') { option.description = 'Farblos'};
            let result = filter.cardColors.find(x => x.code === color);
            if(result === undefined) {
              filter.cardColors.push(option);
            }
          });
          // Card Type - Main
          doc.cardDetails?.cardTypesMain.forEach((type: string) => {
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
          // Card Editions
          let cardEditionExist = filter.cardEditions.includes(doc.cardDetails?.cardEditionCode);
          if(cardEditionExist === false) {
            let option: IFilterOption = {
              code: doc.cardDetails?.cardEditionCode,
              description: doc.cardDetails?.cardEditionName,
              state: false
            }
            filter.cardEditions.push(option);
          }
          // Card Name
          let cardNameExist = filter.cardNamesInOffers.includes(doc.cardDetails?.cardName);
          if(cardNameExist === false) {
            filter.cardNamesInOffers.push(doc.cardDetails?.cardName);
          }
        })
      })
    return new Promise((resolve) => {
      resolve(filter);
    });
  }

  async getOffersByFilter(filter: IFilter, cardNameIsUnique: Boolean = true): Promise<IOffer[]> {
    let offers: IOffer[] = [];
    let result1: IOffer[] = [];
    let result2: IOffer[] = [];

    // Creator
    let queryCreator = query(collection(this._db, this._offersCollection),
                             where('providerUid', '!=', this._currentUserUid));
    await this._dbExt.readDoc<IOffer>(queryCreator)
    .then((snapshot: QuerySnapshot<DocumentData>) => {
      snapshot.forEach((doc: any) => {
        let offer: IOffer = doc as any;
        result1.push(offer);
      });
    });
    // Card Name
    if(filter.cardNameSearch !== null) {
      let queryCardName = query(collection(this._db, this._offersCollection),
                                where('cardName', '==', filter.cardNameSearch));
      await this._dbExt.readDoc<IOffer>(queryCardName)
      .then((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach((doc: any) => {
          let offer: IOffer = doc as any;
          result2.push(offer);
        });
      });
      // Get only Results that are in all Query founded
      offers = [];
      if(result1.length > 0 && result2.length > 0) {
        result2.map(o1 => {
          const obj = result1.find(o2 => o2._id === o1._id );
          if(obj !== undefined) {
            offers.push(obj);
          }
        });
      } else if(result1.length > 0) {
        offers = result1.filter(() => true);
      } else {
        offers = result2.filter(() => true);
      }
      result2 = [];

    } else {
      // Colors
      let filterColor: string[] = [];
      filter.cardColors.forEach((element: IFilterOption) => {
        if(element.state == true) {
          filterColor.push(element.code);
        }
      })
      if(filterColor.length > 0) {
        let queryColor = query(collection(this._db, this._offersCollection),
                               where('cardDetails.cardColors', 'array-contains-any', filterColor));
        await this._dbExt.readDoc<IOffer>(queryColor)
        .then((snapshot: QuerySnapshot<DocumentData>) => {
          snapshot.forEach((doc: any) => {
            let offer: IOffer = doc as any;
            result2.push(offer);
          });
        });
      }
      // Get only Results that are in all Query founded
      offers = [];
      if(result1.length > 0 && result2.length > 0) {
        result2.map(o1 => {
          const obj = result1.find(o2 => o2._id === o1._id );
          if(obj !== undefined) {
            offers.push(obj);
          }
        });
      } else if(result2.length == 0) {
        offers = result1.filter(() => true);
      }
      result2 = [];

      // Card Types
      let filterCardTypes: string[] = [];
      filter.cardTypes.forEach((element: IFilterOption) => {
        if(element.state == true) {
          filterCardTypes.push(element.code);
        }
      })
      if(filterCardTypes.length > 0) {
        let queryCardTypes = query(collection(this._db, this._offersCollection),
                                   where('cardDetails.cardTypesMain', 'array-contains-any', filterCardTypes));
        await this._dbExt.readDoc<IOffer>(queryCardTypes)
        .then((snapshot: QuerySnapshot<DocumentData>) => {
          snapshot.forEach((doc: any) => {
            let offer: IOffer = doc as any;
            result2.push(offer);
          });
        });
      }
      // Get only Results that are in all Query founded
      result1 = offers.filter(() => true);
      offers = [];
      if(result1.length > 0 && result2.length > 0) {
        result2.map(o1 => {
          const obj = result1.find(o2 => o2._id === o1._id );
          if(obj !== undefined) {
            offers.push(obj);
          }
        });
      } else if(result2.length == 0) {
        offers = result1.filter(() => true);
      }
      result2 = [];

      // Card Editions
      let filterCardEditions: string[] = [];
      filter.cardEditions.forEach((element: IFilterOption) => {
        if(element.state == true) {
          filterCardEditions.push(element.code);
        }
      })
      if(filterCardEditions.length > 0) {
        let queryCardEditions = query(collection(this._db, this._offersCollection),
                                      where('cardDetails.cardEditionCode', 'in', filterCardEditions));
        await this._dbExt.readDoc<IOffer>(queryCardEditions)
        .then((snapshot: QuerySnapshot<DocumentData>) => {
          snapshot.forEach((doc: any) => {
            let offer: IOffer = doc as any;
            result2.push(offer);
          });
        });
      }
      // Get only Results that are in all Query founded
      result1 = offers.filter(() => true);
      offers = [];
      if(result1.length > 0 && result2.length > 0) {
        result2.map(o1 => {
          const obj = result1.find(o2 => o2._id === o1._id );
          if(obj !== undefined) {
            offers.push(obj);
          }
        });
      } else if(result2.length == 0) {
        offers = result1.filter(() => true);
      }
      result2 = [];
    }

    // Get Each Card max once time
    if(cardNameIsUnique === true) {
      result1 = offers.filter(() => true);
      offers = [];
      result1.map(o1 => {
        const obj = offers.find(o2 => o2.cardName === o1.cardName );
        if(obj === undefined) {
          offers.push(o1);
        }
      });
    }

    // return
    return new Promise((resolve) => {
      resolve(offers);
    });
  }

  async addToBasket(offerId: string): Promise<IResponse> {
    let ret: IResponse = this._statesDict.UNDEFINED;
    if(this._currentUserUid  === '') {
      ret = this._statesDict.LOGIN_FAILED;
    } else {
      const basketData: IBasketData = {
        _id: '',
        offerId: offerId,
        buyerUid: this._currentUserUid
      }
      await this._dbExt.createDoc<IBasketData>(this._basketCollection,
                                               basketData)
        .then(() => {
          ret = this._statesDict.CREATE_SUCCESS;
        })
    }
    return new Promise((resolve) => {
      resolve(ret);
    });
  }

}

export interface IResponse {
  success: Boolean;
  code: string;
  message: string;
}
export interface IDialogData {
  results: IOffer[],
  filter: IFilter,
}
