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
          cardLanguageIso: res.lang,
          cardType: res.type_line,
          cardColors: res.colors,
          cardEditionCode: res.set,
          cardEditionName: res.set_name,
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
    let queryString: string = '';
    if(filter?.cardTextSearch !== null &&
       filter?.cardTextSearch !== undefined) {
      queryString += queryString == '' ? '': '+';
      queryString += '(';
      let splitt: Array<string> = [];
      splitt = filter.cardTextSearch.split(' ');
      splitt.forEach((element: string) => {
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
      filter.cardColors.forEach((element: IFilterOption) => {
        if(element.code !== '') {
          queryString += element.code;
        }
      });
    }
    if(filter?.cardEditions !== null &&
       filter?.cardEditions !== undefined &&
       filter.cardEditions.length > 0 ) {
      queryString += queryString == '' ? '': '+';
      queryString += '(';
      filter.cardEditions.forEach((element: IFilterOption) => {
        if(element.code !== '') {
          queryString += 'set:' + element.code + '+OR+';
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
      filter.cardTypes.forEach((element: IFilterOption) => {
        if(element.code !== '') {
          queryString += 'type:' + element.code + '+';
        }
      });
      queryString = queryString.slice(0, -1);
      queryString += ')';
    }
    if(queryString !== '') {
      let paginationHasMore: Boolean = true;
      let paginationPage: number = 1;
      url = 'https://api.scryfall.com/cards/search';
      while(paginationHasMore === true)  {
        let urlParams = new HttpParams()
        urlParams = urlParams.set('q', encodeURI(queryString));
        urlParams = urlParams.set('page', paginationPage);
        await this._http.get<IScryfallApiResList>(url,
                                                  { params: urlParams }).toPromise()
          .then((res: IScryfallApiResList) => {
            paginationHasMore = res.has_more;
            let i: number = 0;
            res.data.forEach((element: any) => {
              const cardName: ICardName = {index: i,
                                          name: element.name};
              cardNameList.push(cardName);
              i++;
            })
          })
          .catch((err: any) => {
            paginationHasMore = false;
          })
        paginationPage++;
      }
    } else {
      let urlParams = new HttpParams()
      urlParams = urlParams.set('q', encodeURI(queryString));
      await this._http.get<IScryfallApiResList>(url,
                                                { params: urlParams }).toPromise()
        .then((res: IScryfallApiResList) => {
          let i: number = 0;
          res.data.forEach((element: any) => {
            const cardName: ICardName = {index: i,
                                        name: element};
            cardNameList.push(cardName);
            i++;
          })
        })
        .catch((err: any) => {})
    }
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
  // cardId: string;
  cardName: string;
  cardText: string;
  cardImageUri: string;
  manaCost: string;
  cardLanguageIso: string;
  cardType: string,
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
  cardTextSearch: string | null
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
