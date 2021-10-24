import { ChangeDetectionStrategy, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiScryfallService, ICardName, IEditionName, ICardDetails } from '../../api/api-scryfall.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, map, scan } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchCardComponent implements OnInit {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Declarations
  ////////////////////////////////////////////////////////////////////////////////////////////////

  @Output() onChangeSearchResults = new EventEmitter();

  private _subscriptions: Subscription[] = [];
  private _cardNameListLimit: number = 1000;
  private _cardNameListSearchLimit: number = 20;
  private cardDetailsList: ICardDetails[] = [];

  public editionNameList: IEditionName[] = [];
  public cardNameList: ICardName[] = [];
  public cardNameListOffset: number = 0;
  public cardNameListScroll$: BehaviorSubject<ICardName[]> = new BehaviorSubject<ICardName[]>([]);
  public cardNameSearch: FormControl = new FormControl();
  public searchForm = new FormGroup({
    cardEdition: new FormControl(''),
    cardName: new FormControl(''),
  });


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(private scryfall: ApiScryfallService) {}

  ngOnInit(): void {
    this._subscriptions.push(this.scryfall.getAllEditionNames()
    .subscribe({ next: data => this.editionNameList = data,
                 error: err => console.log(`ERR... ${err}`),
              }));

    this._subscriptions.push(this.scryfall.getAllCardNames()
    .subscribe({  next: (data: ICardName[]) => {
                    this.cardNameListScroll$.pipe(
                        scan((acc: ICardName[], curr: ICardName[]) => {
                          return [...acc, ...curr];
                      }, [])
                  );
                  this.cardNameList = data;
                  this.getLimitedPartOfCardNames();
                },
                error: err => console.log(`ERR... ${err}`),
              }));

    this._subscriptions.push(
      this.cardNameSearch.valueChanges.pipe(
        debounceTime(1000),
      )
      .subscribe((element) => {
        this.searchOfCardNamesChanged(element);
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Form Search (Search Option for API Request to Scryfall)
  ////////////////////////////////////////////////////////////////////////////////////////////////

  onChangeSelectCardEdition(element: string): void {
    this.searchForm.patchValue({
      cardEdition: element
    })
  }

  onChangeSelectCardName(element: string): void {}

  onSubmitSearchForm(): void {
    const edition = this.searchForm.get('cardEdition')?.value;
    const cardName = this.searchForm.get('cardName')?.value;

    this._subscriptions.push(this.scryfall.getCardDetailsByName(cardName)
    .subscribe({  next: (data: ICardDetails) => {
                  this.cardDetailsList = [];
                  this.cardDetailsList.push(data);
                  this.onChangeSearchResults.emit(this.cardDetailsList);
                  }
              })
    );
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Event functions
  ////////////////////////////////////////////////////////////////////////////////////////////////

  getLimitedPartOfCardNames() {
    const result = this.cardNameList.slice(this.cardNameListOffset, this.cardNameListOffset + this._cardNameListLimit);
    this.cardNameListScroll$.next(result);
    this.cardNameListOffset += this._cardNameListLimit;
  }

  searchOfCardNamesChanged(element: string) {
    let name = element ? element.trim() : null;
    if (!name) {
      this.cardNameListScroll$.next(this.cardNameList.slice(0, this._cardNameListLimit))
      return;
    } else {
      name = name.toLowerCase();
    }
    this.cardNameListScroll$.next(this.getAllThatContain(name));
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Functions Sync
  ////////////////////////////////////////////////////////////////////////////////////////////////

  getAllThatContain(element: string): ICardName[] {
    const results: ICardName[] = this.cardNameList.filter((i) => i.name.toLowerCase().indexOf(element.toLowerCase()) > -1);
    return results.slice(0, this._cardNameListSearchLimit);
  }

}
