import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ApiScryfallService, ICardName, IEditionName } from '../api/api-scryfall.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-card-search',
  templateUrl: './card-search.component.html',
  styleUrls: ['./card-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardSearchComponent implements OnInit {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Declarations
  ////////////////////////////////////////////////////////////////////////////////////////////////

  // @ViewChild(CdkVirtualScrollViewport, { static: false })
  // @ViewChild(MatSelect, { static: true })

  private _subscribeEditionNameList: any;
  private _subscribeCardNameList: any;

  public editionNameList: Array<IEditionName> = [];
  public editionNameListIsLoaded: boolean = false;
  public cardNameList: Array<ICardName> = [];
  public cardNameListIsLoaded: boolean = false;

  // public isSubmitted = false;

  public form = new FormGroup({
    cardEditions: new FormControl(''),
    cardNames: new FormControl('')
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(private scryfall: ApiScryfallService,
              // public cdkVirtualScrollViewPort: CdkVirtualScrollViewport,
              // public matSelect: MatSelect
              ) {

    this._subscribeEditionNameList = this.scryfall.getAllEditionNames()
    .subscribe({ next: data => this.editionNameList = data,
                  error: err => console.log(`ERR... ${err}`),
                  complete: () => this.editionNameListIsLoaded = true,
              });

    this._subscribeCardNameList = this.scryfall.getAllCardNames()
    .subscribe({ next: data => this.cardNameList = data,
                  error: err => console.log(`ERR... ${err}`),
                  complete: () => this.cardNameListIsLoaded = true,
              });

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._subscribeCardNameList
    .unsubscribe();

    this._subscribeEditionNameList
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
