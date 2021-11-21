import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class CountryFinderService {

  private apiBaseUrl = '';
  constructor(private _http: HttpClient,
              private _dbExt: DatabaseService) {}

  public getCountryToZip(zip: number) {
    const urlParams = new HttpParams()
      .set('fuzzy', '');

    return this._http.get<any>(this.apiBaseUrl + '/', {params: urlParams})
      .pipe(map((res: any) => {
        console.log(res);
            }),
      )
  }




}
