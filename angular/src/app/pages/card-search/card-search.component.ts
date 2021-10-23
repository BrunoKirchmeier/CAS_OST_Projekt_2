import { ChangeDetectionStrategy, Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { ApiScryfallService, ICardName, IEditionName } from '../../api/api-scryfall.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, map, scan } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-card-search',
  templateUrl: './card-search.component.html',
  styleUrls: ['./card-search.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class CardSearchComponent implements OnInit {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Declarations
  ////////////////////////////////////////////////////////////////////////////////////////////////

  private _subscriptions: Subscription[] = [];
  private _cardNameListLimit: number = 1000;
  private _cardNameListSearchLimit: number = 20;

  public editionNameList: IEditionName[] = [];
  public cardNameList: ICardName[] = [];
  public cardNameListOffset: number = 0;
  public cardNameListScroll$: BehaviorSubject<ICardName[]> = new BehaviorSubject<ICardName[]>([]);
  public cardNameSearch: FormControl = new FormControl();
  public form = new FormGroup({
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
    .subscribe({ next: (data: ICardName[]) => {
                  this.cardNameListScroll$.pipe(
                      scan((acc: ICardName[], curr: ICardName[]) => {
                        console.log('-- LOG:2 ACC --');
                        console.log(acc);
                        console.log('-- LOG:2 CURR --');
                        console.log(curr);
                        return [...acc, ...curr];
                    }, [])
                  );
                  this.cardNameList = data;
                  this.getNextBatch();
                  },
                  error: err => console.log(`ERR... ${err}`),
              }));

    this._subscriptions.push(
      this.cardNameSearch.valueChanges.pipe(
        debounceTime(1000),
      )
      .subscribe((element) => {
        this.searchChanged(element);
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
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

  getNextBatch() {
    const result = this.cardNameList.slice(this.cardNameListOffset, this.cardNameListOffset + this._cardNameListLimit);
    this.cardNameListScroll$.next(result);
    this.cardNameListOffset += this._cardNameListLimit;
  }

  searchChanged(element: string){
    console.log(element);
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
