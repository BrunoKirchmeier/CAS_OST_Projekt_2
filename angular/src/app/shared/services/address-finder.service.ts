import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryFinderService {

  private _subscriptions: Subscription[] = [];
  private _apiBaseUrl = 'https://swisspost.opendatasoft.com/';

  constructor(private _http: HttpClient) {}

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  public getCities(city: string): string[] {
    let response: string[] = [];
    const urlParams = new HttpParams()
      .set('dataset', 'plz_verzeichnis_v2')
      .set('q', city)
    this._subscriptions.push(this._http.get<any>(this._apiBaseUrl + 'api/records/1.0/search/', {params: urlParams}).subscribe(res => {
                              res.records.forEach((element: any) => {
                                // response.push(element?.fields?.ortbez18);
                                response.push(element?.fields?.ortbez27);
                              });
                            })
    );
    return response;
  }

  public getPlz(plz: number): string[] {
    let response: string[] = [];
    const urlParams = new HttpParams()
      .set('dataset', 'plz_verzeichnis_v2')
      .set('q', plz)
    this._subscriptions.push(this._http.get<any>(this._apiBaseUrl + 'api/records/1.0/search/', {params: urlParams}).subscribe(res => {
                              res.records.forEach((element: any) => {
                                response.push(element?.fields?.postleitzahl);
                              });
                            })
    );
    return response;
  }

}
