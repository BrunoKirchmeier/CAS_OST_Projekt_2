import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ApiScryfallService {

  constructor(private _http: HttpClient) {}

  public getAllCardNames() {
    return this._http.get<IScryfallApiResList>('https://api.scryfall.com/catalog/card-names')
      .pipe(map((res: IScryfallApiResList) => {
              let cardNameList: ICardName[] = [];
              let i: number = 0;
              res.data.forEach(element => {
                const cardName: ICardName = {index: i,
                                             name: element};
                cardNameList.push(cardName);
                i++;
              });
              return cardNameList;
            })
        )
  }

  async getCardDetailsByName(cardName: string,
                             format: CardPictureFormat = CardPictureFormat.NORMAL): Promise<any> {
    let cardDetails: ICardDetails;
    const urlParams = new HttpParams()
      .set('fuzzy', cardName);

    await this._http.get<any>('https://api.scryfall.com/cards/named', {params: urlParams}).toPromise()
      .then((res: any) => {
        let uri: string = '';
        if(typeof res === 'object' &&
          res.hasOwnProperty('image_uris') &&
          res.image_uris.hasOwnProperty(format)) {
            uri = res.image_uris[format];
        }
        const obj: ICardDetails =
        {
          cardId: res.id,
          cardName: res.name,
          cardText: res.oracle_text,
          cardImageUri: uri,
          manaCost: res.mana_cost,
          cardLanguageIso: res.lang,
          cardTypeLine: res.type_line,
          cardTypesMain: [],
          cardTypesSecond: [],
          cardColors: res.colors,
          cardEditionCode: res.set,
          cardEditionName: res.set_name,
        }
        // cardType
        let count: number = 1;
        res.type_line.split(' — ')
          .forEach((types: string) => {
            let splitt2 = types.split(' ');
            splitt2.forEach((type: string) => {
              if(count == 1) {
                obj.cardTypesMain.push(type);

              } else if(count > 1) {
                obj.cardTypesSecond.push(type);
              }
          })
          count++;
        })
        cardDetails = obj as any;
      })
      return new Promise((resolve) => {
        resolve(cardDetails);
      });
  }

}

/*
https://api.scryfall.com
We kindly ask that you insert 50 – 100 milliseconds of delay between the requests you send to the server at api.scryfall.co
HTTP 429 Too Many Requests status code. Continuing to overload the API after this point may result in a temporary or permanent ban of your IP address.
For example, if you are submitting a request to a method that requires Application authorization, you must submit an HTTP header like Authorization: Bearer X where X is your client_secret token, including the cs- prefix.
*/
export interface IScryfallApiResList {
  has_more: boolean;
  object: string;
  uri: string;
  total_values: number;
  data: string[];
}

export interface ICardName {
  index: number;
  name: string;
}
export interface IEdition {
  id: string | null;
  code: string;
  name: string;
  uri: string | null;
  scryfall_uri: string | null;
  search_uri: string | null;
  released_at: Date | null;
  set_type: string | null;
  card_count: number | null;
  icon_svg_uri: string | null;
}

/*
  Datatyp: API Scryfall ICardDetails
*/
export interface ICardDetails {
  cardId: string;
  cardName: string;
  cardText: string;
  cardImageUri: string;
  manaCost: string;
  cardLanguageIso: string;
  cardTypeLine: string,
  cardTypesMain: string[],
  cardTypesSecond: string[],
  cardColors: string[],
  cardEditionCode: string,
  cardEditionName: string,
}

export interface IFilter {
  cardTypes: IFilterOption[],
  cardColors: IFilterOption[],
  cardEditions: IFilterOption[],
  cardNamesInOffers: string[],
  cardNameSearch: string | null,
}

export interface IFilterOption {
  code: string,
  description: string,
  state: boolean
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Enum Values
////////////////////////////////////////////////////////////////////////////////////////////////

export enum CardPictureFormat {
  SMALL = 'small',
  NORMAL = 'normal',
  LARGE = 'large',
  PNG = 'png',
  CROP_ART = 'art_crop',
  CROP_BORDER = 'border_crop'
}
