import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'app-filter-dialog',
    templateUrl: './sales-filter.component.html'
})
export class DialogFilterComponent {

  public activeFilters: IFilter = {
    cardCost: {
      min: null,
      max: null,
    },
    salersUid: null,
    cardTypes: null,
    cardColor: null,
    cardEditions: null,
    cardText: null,
    cardName: null
  }

  constructor( public filterDialog: MatDialog,
               public filterDialogRef: MatDialogRef<DialogFilterComponent>) {}


}

export interface IFilterElement {
  code: string;
  description: string;
  state: boolean;
}

export interface IFilter {
  cardCost: { min: number | null, max: number | null },
  salersUid: string[] | null,
  cardTypes: IFilterElement[] | null,
  cardColor: IFilterElement[] | null,
  cardEditions: string[] | null,
  cardText: string | null,
  cardName: string | null
}
