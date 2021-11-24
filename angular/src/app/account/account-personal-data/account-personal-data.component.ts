import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.services';
import { CountryFinderService } from 'src/app/shared/services/address-finder.service';
import { AccountService, IAccountUser } from '../shared/services/account.service';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

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
    firstName: '',
    lastName: '',
    address: '',
    zip: 0,
    city: '',
    country: '',
    phone: '',
    iban: '',
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
              private _countryFinder: CountryFinderService) {
    this._activUser = JSON.parse(this._authService.currentUser);
    this._personalData.email = this._activUser.email;
  }

  ngOnInit(): void {
    this._accountService.getUser()
    .then((res) => {
    })
    this.filteredCityOptions$ = this.form.get('city')?.valueChanges.pipe(
      debounceTime(250),
      map((city) => {
        return this._countryFinder.getCities(city) })
    );
    this.filteredZipOptions$ = this.form.get('zip')?.valueChanges.pipe(
      debounceTime(250),
      map((zip) => {
        return this._countryFinder.getPlz(zip) })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  onSubmitForm() {
    if(this.form.valid) {
      this._personalData.firstName = this.form.get('firstName')?.value;
      this._personalData.lastName = this.form.get('lastName')?.value;
      this._personalData.address = this.form.get('street')?.value;
      this._personalData.zip = this.form.get('zip')?.value;
      this._personalData.city = this.form.get('city')?.value;
      this._personalData.country = this.form.get('country')?.value;
      this._personalData.phone = this.form.get('phone')?.value;
      this._personalData.iban = this.form.get('iban')?.value;
    }




    // CountryFinderService

    // IAccountUser


    this._accountService.updateUser(this._personalData)
    .then((res) => {
    })
  }

  closeSnackBar() {
    this._snackBar.dismiss();
  }


}



