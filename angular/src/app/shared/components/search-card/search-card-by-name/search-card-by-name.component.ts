import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, HostListener } from '@angular/core';
import { ApiScryfallService, ICardName } from '../../../services/scryfallApi.service';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, scan } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-card-by-name',
  templateUrl: './search-card-by-name.component.html',
  styleUrls: ['./search-card-by-name.component.scss'],
})

export class SearchCardByNameComponent implements OnInit, OnDestroy {

  @HostListener("scroll", ['$event.target'])
  @Output() onChangeSearchResults = new EventEmitter();
  @Input() resetForm = () => this.searchForm.reset();

  private _subscriptions: Subscription[] = [];
  private _cardNameListLimit: number = 10;

  public cardNameList: ICardName[] = [];
  public cardNameListSearch$: BehaviorSubject<ICardName[]> = new BehaviorSubject<ICardName[]>([]);
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
                      this.cardNameListSearch$.pipe(
                          scan((acc: ICardName[], curr: ICardName[]) => {
                            return [...acc, ...curr];
                        }, [])
                    );
                    this.cardNameList = data;
                  },
                })
    );
    this._subscriptions.push(
      this.searchForm.controls.cardName
      .valueChanges
      .subscribe(() => {
        this.onChangeValue();
      })
    )
    this._subscriptions.push(
      this.cardNameSearch.valueChanges.pipe(
        debounceTime(500),
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

  async onChangeValue(): Promise<void> {
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

  searchOfCardNamesChanged(element: string) {
    let name = element ? element.trim().toLowerCase() : null;
    if(name !== null) {
      this.cardNameListSearch$.next(this.getAllThatContain(name));
    } else {
      this.cardNameListSearch$.next([]);
    }
  }

  getAllThatContain(element: string): ICardName[] {
    const results: ICardName[] = this.cardNameList.filter((i) => i.name.toLowerCase().indexOf(element.toLowerCase()) > -1);
    return results.slice(0, this._cardNameListLimit);
  }

}
