import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ApiScryfallService, ICardName, ICardDetails } from '../../../services/scryfallApi.service';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, scan } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-card-by-name',
  templateUrl: './search-card-by-name.component.html',
  styleUrls: ['./search-card-by-name.component.scss'],
})

export class SearchCardByNameComponent implements OnInit, OnDestroy {

  @Output() onChangeSearchResults = new EventEmitter();
  @Input() resetForm = () => this.searchForm.reset();

  private _subscriptions: Subscription[] = [];
  private _cardNameListLimit: number = 1000;
  private _cardNameListSearchLimit: number = 20;

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
    this._subscriptions.push(
      this._scryfall.getAllCardNames()
      .subscribe({  next: (data: ICardName[]) => {
                      this.cardNameListScroll$.pipe(
                          scan((acc: ICardName[], curr: ICardName[]) => {
                            return [...acc, ...curr];
                        }, [])
                    );
                    this.cardNameList = data;
                    this.getLimitedPartOfCardNames();
                  },
                })
    );

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

  async onSubmitSearchForm(): Promise<void> {
    const cardName = this.searchForm.get('cardName')?.value;
    if(cardName !== '') {
      await this._scryfall.getCardDetailsByName(cardName)
        .then((res) => {
          this.onChangeSearchResults.emit(res);
        })
    }
    return new Promise((resolve) => {
      resolve();
    });
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
