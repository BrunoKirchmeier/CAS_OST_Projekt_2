import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.services';
import { CountryFinderService } from 'src/app/account/shared/services/address-finder.service';
import { AccountService, IAccountUser } from '../shared/services/account.service';
import { debounceTime, map } from 'rxjs/operators';
import { IbanValidatorService } from '../shared/services/iban-validator.service';

@Component({
  selector: 'app-account-personal-data',
  templateUrl: './account-personal-data.component.html',
  styleUrls: ['./account-personal-data.component.scss']
})
export class AccountPersonalDataComponent implements OnInit {

  private _subscriptions: Subscription[] = [];
  private _activUser: any;
  private _personalData: IAccountUser = {
    email: '',
    firstName: null,
    lastName: null,
    address: null,
    zip: null,
    city: null,
    country: null,
    phone: null,
    iban: null,
  }

  public countries: any[] = [{iso: 'CH', description: 'Schweiz'}]
  public form = new FormGroup({
    firstName: new FormControl('', Validators.compose([])),
    lastName: new FormControl('', Validators.compose([])),
    address: new FormControl('', Validators.compose([])),
    zip: new FormControl('', Validators.compose([])),
    city: new FormControl('', Validators.compose([])),
    country: new FormControl('CH', Validators.compose([])),
    phone: new FormControl('', Validators.compose([])),
    iban: new FormControl('', Validators.compose([])),
  });
  public isSpinnerActive: boolean = false;
  public filteredCityOptions$: Observable<string[]> | undefined = new Observable;
  public filteredZipOptions$: Observable<string[]> | undefined = new Observable;

  constructor(private _snackBar: MatSnackBar,
              private _authService: AuthService,
              private _accountService: AccountService,
              private _countryFinderService: CountryFinderService,
              private _ibanValidatorService: IbanValidatorService) {
    this._activUser = JSON.parse(this._authService.currentUser);
    this._personalData.email = this._activUser.email;
  }

  ngOnInit(): void {
    this._accountService.getUser(this._personalData.email)
    .then((res) => {
      if(res !== undefined) {
        this._personalData.firstName = res.firstName;
        this._personalData.lastName = res.lastName;
        this._personalData.address = res.address;
        this._personalData.zip = res.zip;
        this._personalData.city = res.city;
        this._personalData.country = res.country;
        this._personalData.phone = res.phone;
        this._personalData.iban = res.iban;
        this.form.setValue({
          firstName: res.firstName,
          lastName: res.lastName,
          address: res.address,
          zip: res.zip,
          city: res.city,
          country: res.country,
          phone: res.phone,
          iban: res.iban
       });
      }
    })
    this.filteredCityOptions$ = this.form.get('city')?.valueChanges.pipe(
      debounceTime(250),
      map((city) => {
        return this._countryFinderService.getCities(city) })
    );
    this.filteredZipOptions$ = this.form.get('zip')?.valueChanges.pipe(
      debounceTime(250),
      map((zip) => {
        return this._countryFinderService.getPlz(zip) })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  async onSubmitForm() {
    if(this.form.valid) {
      this.isSpinnerActive = true;

      if(this.form.get('firstName')) {
        this._personalData.firstName = this.form.get('firstName')?.value;
      }
      if(this.form.get('lastName')) {
        this._personalData.lastName = this.form.get('lastName')?.value;
      }
      if(this.form.get('address')) {
        this._personalData.address = this.form.get('address')?.value;
      }
      if(this.form.get('zip')) {
        this._personalData.zip = this.form.get('zip')?.value;
      }
      if(this.form.get('city')) {
        this._personalData.city = this.form.get('city')?.value;
      }
      if(this.form.get('country')) {
        this._personalData.country = this.form.get('country')?.value;
      }
      if(this.form.get('phone')) {
        this._personalData.phone = this.form.get('phone')?.value;
      }
      if(this.form.get('iban')) {
        this._personalData.iban = this.form.get('iban')?.value;
      }
      // IBAN Validation
      const iban = this._personalData.iban as string;
      let isValidIban: boolean = true;
      if(iban !== '') {
        await this._ibanValidatorService.checkIban(iban)
          .then((res) => {
            let propValid     = res?.valid;
            let propIbanVaild = res?.iban?.valid;
            isValidIban       = propValid !== undefined
                              ? propValid
                              : propIbanVaild;
          })
      }
      // DB Access
      if(isValidIban) {
        this._accountService.updateUser(this._personalData)
        .then(() => {
          this.isSpinnerActive = false;
          this._snackBar.open('Der Account wurde aktualisiert');
        })
      } else {
        this.isSpinnerActive = false;
        this._snackBar.open('Ungültige IBAN');
      }
    }
  }

  closeSnackBar() {
    this._snackBar.dismiss();
  }

  async checkIban(iban: string) {
    return await this._ibanValidatorService.checkIban(iban);
  }

}



