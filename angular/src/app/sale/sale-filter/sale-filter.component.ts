import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { IFilterOption } from 'src/app/shared/services/scryfallApi.service';
import { SaleFilterDialogService } from '../shared/sale-filter-dialog.service';
import { IDialogData, SaleService } from '../shared/sale.service ';

@Component({
    selector: 'app-filter-dialog',
    templateUrl: './sale-filter.component.html',
    styleUrls: ['./sale-filter.component.scss']
})
export class DialogFilterComponent implements OnInit, OnDestroy {

  private _subscriptions: Subscription[] = [];

  public inputCardName: FormControl = new FormControl();
  public inputCardNameSearch: FormControl = new FormControl();
  public inputCardEditionSearch: FormControl = new FormControl();
  public allCardEditionOptions: IFilterOption[] = [];
  public CardNameSearchList: string[] = [];
  public useFilterButtonIsDisabled: boolean = false;
  public dialogData: IDialogData = {
    results: [],
    filter: {
      cardTypes: [],
      cardColors: [],
      cardEditions: [],
      cardNamesInOffers: [],
      cardNameSearch: null,
    }
  };

  constructor(private _saleService: SaleService,
              private _saleFilterDialogService: SaleFilterDialogService) {}

  ngOnInit(): void {
    this._subscriptions.push(
      this._saleFilterDialogService.dialogData$
        .subscribe((res: IDialogData) => {
            this.dialogData = res;
            this.allCardEditionOptions = res.filter.cardEditions;
            this.CardNameSearchList = res.filter.cardNamesInOffers;
        })
    );
    this._subscriptions.push(
      this.inputCardEditionSearch.valueChanges.pipe(
        debounceTime(1000),
      )
      .subscribe((value: string) => {
        this.dialogData.filter.cardEditions = value === ''
                                    ? this.allCardEditionOptions
                                    : this.getAllEditionsThatContain(value);
      })
    );
    this._subscriptions.push(
      this.inputCardName.valueChanges
      .subscribe((value: string) => {
        this.dialogData.filter.cardNameSearch = value;
        this.searchFiltertCards();
      })
    );
    this._subscriptions.push(
      this.inputCardNameSearch.valueChanges.pipe(
        debounceTime(500),
      )
      .subscribe((element) => {
        this.cardNameSearchChanged(element);
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  setFilterCardColor(e: any, cardColor: IFilterOption) {
    let data = this.dialogData.filter.cardColors;
    let index = data.findIndex((item => item.code === cardColor.code));
    if(index >= 0) {
      data[index].state = e.checked;
      this.dialogData.filter.cardColors = data;
    }
    this.dialogData.filter.cardNameSearch = null;
    this.searchFiltertCards();
  }

  setFilterCardType(e: any, cardTyp: IFilterOption) {
    let data = this.dialogData.filter.cardTypes;
    let index = data.findIndex((item => item.code === cardTyp.code));
    if(index >= 0) {
      data[index].state = e.checked;
      this.dialogData.filter.cardTypes = data;
    }
    this.dialogData.filter.cardNameSearch = null;
    this.searchFiltertCards();
  }

  setFilterEdition(e: any, cardEdition: IFilterOption) {
    let data = this.dialogData.filter.cardEditions;
    let index = data.findIndex((item => item.code === cardEdition.code));
    if(index >= 0) {
      data[index].state = e.checked;
      this.dialogData.filter.cardEditions = data;
    }
    this.dialogData.filter.cardNameSearch = null;
    this.searchFiltertCards();
  }

  searchFiltertCards() {
    this.useFilterButtonIsDisabled = true;
    this._saleService.getOffersByFilter(this.dialogData.filter)
     .then((res) => {
       this.dialogData.results = res;
       this.useFilterButtonIsDisabled = false;
      }
    )
  }

  getAllEditionsThatContain(element: string): IFilterOption[] {
    return this.allCardEditionOptions.filter((i) => i.description.toLowerCase().indexOf(element.toLowerCase()) > -1);
  }

  cardNameSearchChanged(element: string) {
    let name = element ? element.trim().toLowerCase() : null;
    if(name !== null) {
      this.CardNameSearchList = this.getAllThatContain(name);
    } else {
      this.CardNameSearchList = this.dialogData.filter.cardNamesInOffers;
    }
  }

  getAllThatContain(element: string): string[] {
    const results: string[] = this.dialogData.filter.cardNamesInOffers.filter((name) => name.toLowerCase().indexOf(element.toLowerCase()) > -1);
    return results.slice(0, 20);
  }


}

