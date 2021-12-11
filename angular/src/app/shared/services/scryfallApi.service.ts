import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ApiScryfallService {

  constructor(private _http: HttpClient) {}

  get cardColors(): IFilterOption[] {
    const colors = [
      { code: 'W', description: 'Weiss'},
      { code: 'U', description: 'Blau'},
      { code: 'B', description: 'Schwarz'},
      { code: 'R', description: 'Rot'},
      { code: 'G', description: 'Grün'},
    ];
    return colors;
  }

  get cardTypes(): IFilterOption[] {
    const cardTypes = [
      { code: 'artifact', description: 'Artefakte'},
      { code: 'creature', description: 'Kreaturen'},
      { code: 'planeswalker', description: 'Planeswalker'},
      { code: 'enchantment', description: 'Verzauberungen'},
      { code: 'instant', description: 'Spontanzauber'},
      { code: 'sorcery', description: 'Hexereien'},
      { code: 'land', description: 'Länder'},
    ];
    return cardTypes;
  }

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

  public getAllEditions() {
    return this._http.get<IScryfallApiResList>('https://api.scryfall.com/sets')
      .pipe(map((res: IScryfallApiResList) => {
              let editionNameList: IEdition[] = [];
              res.data.forEach((element: any) => {
                const obj: IEdition = element;
                editionNameList.push(obj);
              });
              return editionNameList;
            })
      )
  }

  async cardTextSearch(searchText: string): Promise<ICardName[]> {
    let cardNameList: ICardName[] = [];
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
          cardNameList.push(cardName);
          i++;
        });
      });
    return new Promise((resolve) => {
      resolve(cardNameList);
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

  async getCardsByFilter(filter: IFilter): Promise<ICardName[]> {
    let cardNameList: ICardName[] = [];
    let url: string = 'https://api.scryfall.com/catalog/card-names';
    let urlParams = new HttpParams()
    let queryString: string = '';

    if(filter?.cardText !== null &&
       filter?.cardText !== undefined) {
      queryString += queryString == '' ? '': '+';
      queryString += '(';
      let splitt: Array<string> = [];
      splitt = filter.cardText.split(' ');
      splitt.forEach((element: any) => {
        if(element !== '') {
          queryString += 'oracle:' + element + '+';
        }
      });
      queryString = queryString.slice(0, -1);
      queryString += ')';
    }

    if(filter?.cardColors !== null &&
       filter?.cardColors !== undefined &&
       filter.cardColors.length > 0) {
      queryString += queryString == '' ? '': '+';
      queryString += 'color=';
      filter.cardColors.forEach((element: any) => {
        if(element !== '') {
          queryString += element;
        }
      });
    }

    if(filter?.cardEditions !== null &&
       filter?.cardEditions !== undefined &&
       filter.cardEditions.length > 0 ) {
      queryString += queryString == '' ? '': '+';
      queryString += '(';
      filter.cardEditions.forEach((element: any) => {
        if(element !== '') {
          queryString += 'set:' + element + '+OR+';
        }
      });
      queryString = queryString.slice(0, -4);
      queryString += ')';
    }

    if(filter?.cardTypes !== null &&
       filter?.cardTypes !== undefined &&
       filter.cardTypes.length > 0 ) {
      queryString += queryString == '' ? '': '+';
      queryString += '(';
      filter.cardTypes.forEach((element: any) => {
        if(element !== '') {
          queryString += 'type:' + element + '+';
        }
      });
      queryString = queryString.slice(0, -1);
      queryString += ')';
    }
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
console.log(queryString);
    if(queryString !== '') {
      urlParams = urlParams.set('q', encodeURI(queryString));
      url = 'https://api.scryfall.com/cards/search';
    }
    await this._http.get<IScryfallApiResList>(url,
                                              { params: urlParams }).toPromise()
      .then((res: IScryfallApiResList) => {
        let i: number = 0;
        res.data.forEach((element: any) => {
          const cardName: ICardName = {index: i,
                                       name: element.name};
          cardNameList.push(cardName);
          i++;
        });
      })
      .catch((err: any) => {})
    return new Promise((resolve) => {
      resolve(cardNameList);
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
export interface IEdition {
  object: string;
  id: string;
  code: string;
  tcgplayer_id: number;
  cardName: string;
  name: string;
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


export interface IFilterOption {
  code: string,
  description: string,
}

export interface IFilter {
  cardTypes: string[],
  cardColors: string[],
  cardEditions: string[],
  cardText: string | null,
  cardName: string | null
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
