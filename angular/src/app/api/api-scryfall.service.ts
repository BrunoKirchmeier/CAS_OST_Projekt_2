import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiScryfallService {

  constructor(private http: HttpClient) {}

  public getAllCardNames() {
    const obs = this.http.get<string>('https://api.scryfall.com/catalog/card-names', {observe: 'response'})
    .subscribe(resp => {
      console.log(resp);
    });

    /*
    obs.subscribe((result) => {
    });
    */

    return obs;

  }

/*

https://api.scryfall.com

We kindly ask that you insert 50 – 100 milliseconds of delay between the requests you send to the server at api.scryfall.co
HTTP 429 Too Many Requests status code. Continuing to overload the API after this point may result in a temporary or permanent ban of your IP address.

For example, if you are submitting a request to a method that requires Application authorization, you must submit an HTTP header like Authorization: Bearer X where X is your client_secret token, including the cs- prefix.

*/


}
