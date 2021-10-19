import { Component, OnInit } from '@angular/core';
import { ApiScryfallService, ICardName } from '../api/api-scryfall.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-card-search',
  templateUrl: './card-search.component.html',
  styleUrls: ['./card-search.component.scss']
})
export class CardSearchComponent implements OnInit {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Declarations
  ////////////////////////////////////////////////////////////////////////////////////////////////

  private _subscribeCardNameList: any;

  public cardNameList: Array<ICardName> = [];
  public cardNameListIsLoaded: boolean = false;

  // public isSubmitted = false;
  public form = new FormGroup({
    cardEdition: new FormControl(''),
    cardName: new FormControl('')
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(private scryfall: ApiScryfallService) {}

  ngOnInit(): void {
    this._subscribeCardNameList = this.scryfall.getAllCardNames()
                                  .subscribe({ next: data => this.cardNameList = data,
                                               error: err => console.log(`ERR... ${err}`),
                                               complete: () => this.cardNameListIsLoaded = true,
                                            });
  }

  ngOnDestroy(): void {
    this._subscribeCardNameList
    .unsubscribe();
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Events
  ////////////////////////////////////////////////////////////////////////////////////////////////

  onFormSubmit(): void {
    // console.log('Name:' + this.form.get('cardName').value);
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Functions
  ////////////////////////////////////////////////////////////////////////////////////////////////








}
