import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ApiScryfallService, ICardName, IEditionName } from '../api/api-scryfall.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { scan } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

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

  private _subscribeEditionNameList: any;
  private _subscribeCardNameList: any;
  private _cardNameListLimit: number = 100;
  private _cardNameListBehaviorSub = new BehaviorSubject<ICardName[]>([]);

  public editionNameList: Array<IEditionName> = [];
  public cardNameList: Array<ICardName> = [];
  public cardNameListOffset: number = 0;
  public cardNameListScroll$: any;

  public form = new FormGroup({
    cardEditions: new FormControl(''),
    cardNames: new FormControl('')
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(private scryfall: ApiScryfallService) {

    this._subscribeEditionNameList = this.scryfall.getAllEditionNames()
    .subscribe({ next: data => this.editionNameList = data,
                 error: err => console.log(`ERR... ${err}`),
              });

    this._subscribeCardNameList = this.scryfall.getAllCardNames()
    .subscribe({ next: (data: ICardName[]) => {
                  this.cardNameListScroll$ =
                  this._cardNameListBehaviorSub.asObservable().pipe(
                      scan((acc: Array<ICardName>, curr: Array<ICardName>) => {
                        return [...acc, ...curr];
                    }, [])
                  );
                  this.cardNameList = data;
                  this.getNextBatch();
                 },
                 error: err => console.log(`ERR... ${err}`),
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

  getNextBatch() {
    const result = this.cardNameList.slice(this.cardNameListOffset, this.cardNameListOffset + this._cardNameListLimit);
    this._cardNameListBehaviorSub.next(result);
    this.cardNameListOffset += this._cardNameListLimit;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Functions
  ////////////////////////////////////////////////////////////////////////////////////////////////





}
