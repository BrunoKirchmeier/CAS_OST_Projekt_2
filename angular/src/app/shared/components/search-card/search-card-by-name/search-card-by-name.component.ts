import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiScryfallService, ICardName, IEditionName, ICardDetails } from '../../../services/scryfallApi.service';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, scan } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-card-by-name',
  templateUrl: './search-card-by-name.component.html',
  styleUrls: ['./search-card-by-name.component.scss'],
})

export class SearchCardByNameComponent implements OnInit {

  @Output() onChangeSearchResults = new EventEmitter();
  @Input() resetForm = () => this.searchForm.reset();

  private _subscriptions: Subscription[] = [];
  private _cardNameListLimit: number = 1000;
  private _cardNameListSearchLimit: number = 20;
  private _cardDetailsList: ICardDetails[] = [];

  public editionNameList: IEditionName[] = [];
  public cardNameList: ICardName[] = [];
  public cardNameListOffset: number = 0;
  public cardNameListScroll$: BehaviorSubject<ICardName[]> = new BehaviorSubject<ICardName[]>([]);
  public cardNameSearch: FormControl = new FormControl();
  public searchForm = new FormGroup({
    cardEdition: new FormControl(''),
    cardName: new FormControl(''),
  });

  constructor(private _scryfall: ApiScryfallService) {}

  ngOnInit(): void {
    this._subscriptions.push(this._scryfall.getAllEditionNames()
    .subscribe({ next: data => this.editionNameList = data,
                 error: err => console.log(`ERR... ${err}`),
              }));

    this._subscriptions.push(this._scryfall.getAllCardNames()
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

  onChangeSelectCardEdition(element: string): void {
    this.searchForm.patchValue({
      cardEdition: element
    })
  }

  onChangeSelectCardName(element: string): void {}

  onSubmitSearchForm(): void {
    const edition = this.searchForm.get('cardEdition')?.value;
    const cardName = this.searchForm.get('cardName')?.value;

    this._subscriptions.push(this._scryfall.getCardDetailsByName(cardName)
    .subscribe({  next: (data: ICardDetails) => {
                  this._cardDetailsList = [];
                  this._cardDetailsList.push(data);
                  this.onChangeSearchResults.emit(this._cardDetailsList);
                  }
              })
    );
  }

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

  getAllThatContain(element: string): ICardName[] {
    const results: ICardName[] = this.cardNameList.filter((i) => i.name.toLowerCase().indexOf(element.toLowerCase()) > -1);
    return results.slice(0, this._cardNameListSearchLimit);
  }

}
