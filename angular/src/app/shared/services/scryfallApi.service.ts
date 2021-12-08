import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ApiScryfallService {

  private _cardNameList: ICardName[] = [];
  private _editionNameList: IEditionName[] = [];

  constructor(private _http: HttpClient) {}

  public getAllCardNames() {
    return this._http.get<IScryfallApiResList>('https://api.scryfall.com/catalog/card-names')
      .pipe(map((res: IScryfallApiResList) => {
              let i: number = 0;
              res.data.forEach(element => {
                const cardName: ICardName = {index: i,
                                             name: element};
                this._cardNameList.push(cardName);
                i++;
              });
              return this._cardNameList;
            })
        )
  }

  public getAllEditionNames() {
    return this._http.get<IScryfallApiResList>('https://api.scryfall.com/sets')
      .pipe(map((res: IScryfallApiResList) => {
              res.data.forEach((element: any) => {
                const obj: IEditionName = element;
                this._editionNameList.push(obj);
              });
              return this._editionNameList;
            })
      )
  }

  async cardTextSearch(searchText: string): Promise<ICardName[]> {
    let splitt: Array<string> = [];
    let queryString = '(';
    splitt = searchText.split(' ');
    splitt.forEach((element: any) => {
      queryString += 'oracle:' + element + '+';
    });
    queryString = queryString.slice(0, -1);
    queryString += ')';
    const urlParams = new HttpParams()
      .set('q', encodeURI(queryString))
    await this._http.get<IScryfallApiResList>('https://api.scryfall.com/cards/search',
                                              { params: urlParams }).toPromise()
      .then((res: IScryfallApiResList) => {
        let i: number = 0;
        res.data.forEach((element: any) => {
          const cardName: ICardName = {index: i,
                                       name: element.name};
          this._cardNameList.push(cardName);
          i++;
        });
      });
    return new Promise((resolve) => {
      resolve(this._cardNameList);
    });
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
          cardName: res.name,
          cardText: res.oracle_text,
          cardImageUri: uri,
          manaCost: res.mana_cost,
          cardLanguageIso: res.lang
        }
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
  object: string;
  uri: string;
  total_values: number;
  data: string[];
}
export interface ICardName {
  index: number;
  name: string;
}
export interface IEditionName {
  object: string;
  id: string;
  code: string;
  tcgplayer_id: number;
  cardName: string;
  uri: string;
  scryfall_uri: string;
  search_uri: string;
  released_at: Date;
  set_type: string;
  card_count: number;
  digital: boolean;
  nonfoil_only: boolean;
  foil_only: boolean;
  icon_svg_uri: string;
}

/*
  Datatyp: API Scryfall ICardDetails
*/
export interface ICardDetails {
  cardName: string | null;
  cardText: string | null;
  cardImageUri: string | null;
  manaCost: string | null;
  cardLanguageIso: string | null;
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
