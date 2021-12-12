import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ApiScryfallService, IEdition, IFilterOption, IFilter } from 'src/app/shared/services/scryfallApi.service';
import { SalesFilterDialogService } from '../shared/sales-filter-dialog.service';
import { IDialogData, SalesService } from '../shared/sales.service ';

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
    cardNamesInOffers: [],
    cardNameSearch: null,
    cardTextSearch: null
  }
  public filtersOptionsCardColors: IFilterOption[] = [];
  public filtersOptionsCardTypes: IFilterOption[] = [];
  public filtersOptionsEditions: IFilterOption[] = [];
  public inputCardText: FormControl = new FormControl();
  public inputCardEdition: FormControl = new FormControl();
  public useFilterButtonIsDisabled: boolean = false;
  public dialogData: IDialogData = {
    results: [],
    filter: this.activeFilters
  };

  constructor(private _scryfall: ApiScryfallService,
              private _salesService: SalesService,
              private _salesFilterDialogService: SalesFilterDialogService) {
  }

  ngOnInit(): void {
    this._subscriptions.push(
      this._salesFilterDialogService.dialogData$
        .subscribe((res: IDialogData | null) => {
          if(res !== null) {
            this.dialogData = res;
            this.filtersOptionsCardColors = res.filter?.cardColors ?? [];
            this.filtersOptionsCardTypes = res.filter?.cardTypes ?? [];
            this.filtersOptionsEditions = res.filter?.cardEditions ?? [];

            console.log(res);
          }
        })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  setFilterCardText(){}

  setFilterEdition(e: any, cardEdition: IFilterOption) {}

  setFilterCardColor(e: any, cardColor: IFilterOption) {}

  setFilterCardType(e: any, cardTyp: IFilterOption) {}

}

