import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.prod'

@Injectable({
  providedIn: 'root'
})
export class IbanValidatorService {

  private _httpHeaders = new HttpHeaders({'Authorization': 'token ' + environment.ibanValidationApiKey});
  private _apiBaseUrl  = 'https://fintechtoolbox.com/';

  constructor(private _http: HttpClient) {}

  async checkIban(iban: string): Promise<any> {
    const body = new HttpParams()
      .set('iban', iban)
    return this._http.post<any>(this._apiBaseUrl + 'validate/iban.json',
                                      body,
                                      { headers: this._httpHeaders })
                          .toPromise();
  }

}
