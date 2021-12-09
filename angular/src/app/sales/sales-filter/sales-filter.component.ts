import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Subscription } from 'rxjs';
import { ApiScryfallService, IEditionName, IFilterOption } from 'src/app/shared/services/scryfallApi.service';

@Component({
    selector: 'app-filter-dialog',
    templateUrl: './sales-filter.component.html',
    styleUrls: ['./sales-filter.component.scss']
})
export class DialogFilterComponent implements OnInit, OnDestroy {

  private _subscriptions: Subscription[] = [];

  public activeFilters: IFilter = {
    salersUid: [],
    cardTypes: [],
    cardColors: [],
    cardEditions: [],
    cardText: null,
    cardName: null
  }

  public filtersOptionsCardColors = this._scryfall.cardColors;
  public filtersOptionsCardTypes = this._scryfall.cardTypes;
  public filtersOptionsEditions: IEditionName[] = [];
  public form = new FormGroup({
    cardText: new FormControl('', Validators.compose([])),
  });

  constructor( private _scryfall: ApiScryfallService,
               public filterDialog: MatDialog,
               public filterDialogRef: MatDialogRef<DialogFilterComponent> ) {}

  ngOnInit(): void {
    this._subscriptions.push(
      this._scryfall.getAllEditionNames()
      .subscribe({ next: (data: any[]) => {
                  this.filtersOptionsEditions = data;
                  },
                })
    )
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  setFilterCardText() {
    this.activeFilters.cardText = this.form.get('cardText')?.value;
  }

  setFilterEdition(e: any, cardEdition: IEditionName) {
    if(e.checked === true) {
      this.activeFilters.cardEditions.push(cardEdition.name);
    } else {
      this.activeFilters.cardEditions = this.activeFilters.cardEditions.filter(element => element !== cardEdition.name);
    }
  }

  setFilterCardColor(e: any, cardColor: IFilterOption) {
    if(e.checked === true) {
      this.activeFilters.cardColors.push(cardColor.code);
    } else {
      this.activeFilters.cardColors = this.activeFilters.cardColors.filter(element => element !== cardColor.code);
    }
  }

  setFilterCardType(e: any, cardTyp: IFilterOption) {
    if(e.checked === true) {
      this.activeFilters.cardTypes.push(cardTyp.code);
    } else {
      this.activeFilters.cardTypes = this.activeFilters.cardTypes.filter(element => element !== cardTyp.code);
    }
  }


}

export interface IFilter {
  salersUid: string[],
  cardTypes: string[],
  cardColors: string[],
  cardEditions: string[],
  cardText: string | null,
  cardName: string | null
}
