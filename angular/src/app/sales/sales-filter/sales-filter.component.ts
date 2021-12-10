import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ApiScryfallService, IEdition, IFilterOption, IFilter, ICardName } from 'src/app/shared/services/scryfallApi.service';
import { SalesService } from '../shared/sales.service ';

@Component({
    selector: 'app-filter-dialog',
    templateUrl: './sales-filter.component.html',
    styleUrls: ['./sales-filter.component.scss']
})
export class DialogFilterComponent implements OnInit, OnDestroy {

  private _subscriptions: Subscription[] = [];

  public activeFilters: IFilter = {
    cardTypes: [],
    cardColors: [],
    cardEditions: [],
    cardText: null,
    cardName: null
  }

  public filtersOptionsCardColors = this._scryfall.cardColors;
  public filtersOptionsCardTypes = this._scryfall.cardTypes;
  public filtersOptionsAllEditions: IEdition[] = [];
  public filtersOptionsEditions: IEdition[] = [];
  public inputCardText: FormControl = new FormControl();
  public inputCardEdition: FormControl = new FormControl();
  public offersFiltert: ICardName[] = [];

  constructor( private _scryfall: ApiScryfallService,
               private _salesService: SalesService,
               public filterDialog: MatDialog,
               public filterDialogRef: MatDialogRef<DialogFilterComponent> ) {
    this.setFilterCardText();
  }

  ngOnInit(): void {
    this._subscriptions.push(
      this._scryfall.getAllEditions()
      .subscribe({ next: (data: IEdition[]) => {
                   this.filtersOptionsAllEditions = data;
                   this.filtersOptionsEditions = data;
                  },
                })
    )
    this._subscriptions.push(
      this.inputCardEdition.valueChanges.pipe(
        debounceTime(1000),
      )
      .subscribe((value: string) => {
        this.filtersOptionsEditions = value === ''
                                    ? this.filtersOptionsAllEditions
                                    : this.getAllEditionsThatContain(value);
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  setFilterCardText() {
    this.activeFilters.cardText = this.inputCardText?.value;
    this.getCards();
  }

  setFilterEdition(e: any, cardEdition: IEdition) {
    if(e.checked === true) {
      this.activeFilters.cardEditions.push(cardEdition.code);
    } else {
      this.activeFilters.cardEditions = this.activeFilters.cardEditions.filter(element => element !== cardEdition.code);
    }
    this.getCards();
  }

  setFilterCardColor(e: any, cardColor: IFilterOption) {
    if(e.checked === true) {
      this.activeFilters.cardColors.push(cardColor.code);
    } else {
      this.activeFilters.cardColors = this.activeFilters.cardColors.filter(element => element !== cardColor.code);
    }
    this.getCards();
  }

  setFilterCardType(e: any, cardTyp: IFilterOption) {
    if(e.checked === true) {
      this.activeFilters.cardTypes.push(cardTyp.code);
    } else {
      this.activeFilters.cardTypes = this.activeFilters.cardTypes.filter(element => element !== cardTyp.code);
    }
    this.getCards();
  }

  getAllEditionsThatContain(element: string): IEdition[] {
    const results: IEdition[] = this.filtersOptionsEditions.filter((i) => i.name.indexOf(element) > -1);
    return results;
  }

  getCards() {
    this._salesService.getCardsByFilter(this.activeFilters)
     .then((res) => { this.offersFiltert = res }
    )
  }

}

