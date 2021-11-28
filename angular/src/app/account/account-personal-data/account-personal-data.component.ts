import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.services';
import { CountryFinderService, ICountry } from 'src/app/account/shared/services/address-finder.service';
import { AccountService, IAccountUser } from '../shared/services/account.service';
import { debounceTime, map } from 'rxjs/operators';
import { IbanValidatorService } from '../shared/services/iban-validator.service';
import { IbanFormatterPipe } from '../shared/pipes/iban-formatter.pipe'

@Component({
  selector: 'app-account-personal-data',
  templateUrl: './account-personal-data.component.html',
  styleUrls: ['./account-personal-data.component.scss']
})
export class AccountPersonalDataComponent implements OnInit, OnDestroy {

  private _subscriptions: Subscription[] = [];
  private _activUser: any;
  private _personalData: IAccountUser = {
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    zip: '',
    city: '',
    countryIso: '',
    phone: '',
    iban: '',
  }

  public countries: Array<ICountry> = [];
  public form = new FormGroup({
    firstName: new FormControl('', Validators.compose([])),
    lastName: new FormControl('', Validators.compose([])),
    address: new FormControl('', Validators.compose([])),
    zip: new FormControl('', Validators.compose([])),
    city: new FormControl('', Validators.compose([])),
    countryIso: new FormControl('', Validators.compose([])),
    phonePrefix: new FormControl('', Validators.compose([])),
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
              private _ibanValidatorService: IbanValidatorService,
              private _IbanFormatterPipe: IbanFormatterPipe) {
    this._activUser = JSON.parse(this._authService.currentUser);
    this._personalData.email = this._activUser.email;
    this.countries = this._countryFinderService.getCountries();
  }

  ngOnInit(): void {
    this._accountService.getUser(this._personalData.email)
    .then((val) => {
      if(val !== undefined && val !== null) {
        const phonePrefix: string = this.searchPhonePrefix(val.countryIso);
        val.phonePrefix = phonePrefix;
        this.setFormValues(val);
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
    this._subscriptions.push(
      this.form.valueChanges.subscribe((val) => {
        if(val !== undefined && val !== null) {
          const phonePrefix: string = this.searchPhonePrefix(val.countryIso);
          val.phonePrefix = phonePrefix;
          this.setFormValues(val);
        }
      })
    )
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  async onSubmitForm() {
    if(this.form.valid) {
      this.isSpinnerActive = true;
      // IBAN Validation
      const iban = this._personalData.iban as string;
      let isValidIban: boolean = true;
      console.log(iban);
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

  searchPhonePrefix(iso: string) {
    const countryElement: any = this.countries.find(i => i.iso == iso);
    const phonePrefix: string = countryElement === undefined
                              ? ''
                              : countryElement.countryPhonePrefix;
    return phonePrefix;
  }

  setFormValues(form: any) {
    // Raw Values witout formations
    this._personalData.firstName = form.firstName;
    this._personalData.lastName = form.lastName;
    this._personalData.address = form.address;
    this._personalData.zip = form.zip;
    this._personalData.city = form.city;
    this._personalData.countryIso = form.countryIso;
    this._personalData.phone = form.phone;
    this._personalData.iban = this._IbanFormatterPipe.rawValue(form.iban);
    // Formatted Values for View
    this.form.setValue({
      firstName: form.firstName,
      lastName: form.lastName,
      address: form.address,
      zip: form.zip,
      city: form.city,
      countryIso: form.countryIso,
      phonePrefix: form.phonePrefix,
      phone: form.phone,
      iban: this._IbanFormatterPipe.transform(form.iban)
    },
    { emitEvent: false });
  }

  async checkIban(iban: string) {
    return await this._ibanValidatorService.checkIban(iban);
  }

}
