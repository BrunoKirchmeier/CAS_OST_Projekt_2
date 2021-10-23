import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ApiScryfallService {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Declarations
  ////////////////////////////////////////////////////////////////////////////////////////////////

  private _errorCounter: number = 0;
  private _cardNameList: ICardName[] = [];
  private _editionNameList: IEditionName[] = [];

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(private _http: HttpClient) {}

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // API calls
  ////////////////////////////////////////////////////////////////////////////////////////////////

  /*
    Function: getAllCardNames
    List of all existing cards
  */
  public getAllCardNames() {
    return this._http.get<IApiResponseScryfallListtype>('https://api.scryfall.com/catalog/card-names')
      .pipe(map((res: IApiResponseScryfallListtype) => {
              let i: number = 0;
              res.data.forEach(element => {
                const cardName: ICardName = {id: i,
                                             name: element};
                this._cardNameList.push(cardName);
                i++;
              });
              return this._cardNameList;
            }),
            catchError((error,src) => {
              console.log('Exeption geworfen!!!!')
              this._errorCounter++;
              if (this._errorCounter < 2) {
                return src;
              } else {
                throw new Error(error)
              }
            })
      )
    }

  /*
    Function: getAllEditionNames
    List of all existing cards
  */
    public getAllEditionNames() {
      return this._http.get<IApiResponseScryfallListtype>('https://api.scryfall.com/sets')
        .pipe(map((res: IApiResponseScryfallListtype) => {
                res.data.forEach((element: any) => {
                  const obj: IEditionName = element;
                  this._editionNameList.push(obj);
                });
                return this._editionNameList;
              }),
              catchError((error,src) => {
                console.log('Exeption geworfen!!!!')
                this._errorCounter++;
                if (this._errorCounter < 2) {
                  return src;
                } else {
                  throw new Error(error)
                }
              })
        )
      }

  /*
    Function: getCardDetailsByName
    Get the detail Information of a single Card
  */
    public getCardDetailsByName(cardName: string,
                                format: CardPictureFormat = CardPictureFormat.Normal) {
      const urlParams = new HttpParams()
        .set('fuzzy', cardName);

      return this._http.get<any>('https://api.scryfall.com/cards/named', {params: urlParams})
        .pipe(map((res: any) => {
                let uri: string = '';
                if(typeof res === 'object' &&
                  res.hasOwnProperty('image_uris') &&
                  res.image_uris.hasOwnProperty(format)) {
                    uri = res.image_uris[format];
                }
                const obj: ICardDetails =
                {
                  oracle_text: res.oracle_text,
                  card_image_uri: uri,
                  mana_cost: res.mana_cost
                }
                return obj;
              }),
              catchError((error,src) => {
                console.log('Exeption geworfen!!!!')
                this._errorCounter++;
                if (this._errorCounter < 2) {
                  return src;
                } else {
                  throw new Error(error)
                }
              })
        )
      }





/*

https://api.scryfall.com

We kindly ask that you insert 50 – 100 milliseconds of delay between the requests you send to the server at api.scryfall.co
HTTP 429 Too Many Requests status code. Continuing to overload the API after this point may result in a temporary or permanent ban of your IP address.

For example, if you are submitting a request to a method that requires Application authorization, you must submit an HTTP header like Authorization: Bearer X where X is your client_secret token, including the cs- prefix.

*/


}

////////////////////////////////////////////////////////////////////////////////////////////////
// Interfaces
////////////////////////////////////////////////////////////////////////////////////////////////

/*
  Datatyp: API Scryfall Response of List Objects
*/
export interface IApiResponseScryfallListtype {
  object: string;
  uri: string;
  total_values: number;
  data: string[];
}

/*
  Datatyp: API Scryfall card names
*/
export interface ICardName {
  id: number;
  name: string;
}

/*
  Datatyp: API Scryfall editon names
*/
export interface IEditionName {
  object: string;
  id: string;
  code: string;
  tcgplayer_id: number;
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
  oracle_text: string;
  card_image_uri: string;
  mana_cost: string;
}


////////////////////////////////////////////////////////////////////////////////////////////////
// Interfaces
////////////////////////////////////////////////////////////////////////////////////////////////

export enum CardPictureFormat {
  Small = 'small',
  Normal = 'normal',
  Large = 'large',
  PNG = 'png',
  CropArt = 'art_crop',
  CropBorder = 'border_crop'
}
