import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { IFilterOption } from 'src/app/shared/services/scryfallApi.service';
import { SalesFilterDialogService } from '../shared/sales-filter-dialog.service';
import { IDialogData, SalesService } from '../shared/sales.service ';

@Component({
    selector: 'app-filter-dialog',
    templateUrl: './sales-filter.component.html',
    styleUrls: ['./sales-filter.component.scss']
})
export class DialogFilterComponent implements OnInit, OnDestroy {

  private _subscriptions: Subscription[] = [];

  public inputCardName: FormControl = new FormControl();
  public inputCardEditionSearch: FormControl = new FormControl();
  public allCardEditionOptions: IFilterOption[] = [];
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

  constructor(private _salesService: SalesService,
              private _salesFilterDialogService: SalesFilterDialogService) {}

  ngOnInit(): void {
    this._subscriptions.push(
      this._salesFilterDialogService.dialogData$
        .subscribe((res: IDialogData) => {
          this.dialogData = res;
          this.allCardEditionOptions = res.filter.cardEditions;
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
    this._salesService.getOffersByFilter(this.dialogData.filter)
     .then((res) => {
       this.dialogData.results = res;
       this.useFilterButtonIsDisabled = false;
      }
    )
  }

  getAllEditionsThatContain(element: string): IFilterOption[] {
    return this.allCardEditionOptions.filter((i) => i.description.toLowerCase().indexOf(element.toLowerCase()) > -1);
  }

}

