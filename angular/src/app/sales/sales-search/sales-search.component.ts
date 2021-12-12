import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IDialogData, SalesService } from '../shared/sales.service ';
import { Subject, Subscription } from 'rxjs';
import { IOffer } from 'src/app/offer/shared/services/offer.service';
import { SalesFilterDialogService } from '../shared/sales-filter-dialog.service';
import { IFilter, IFilterOption } from 'src/app/shared/services/scryfallApi.service';

@Component({
  selector: 'app-sales-search',
  templateUrl: './sales-search.component.html',
  styleUrls: ['./sales-search.component.scss']
})
export class SalesSearchComponent implements OnInit, OnDestroy {

  private _subscriptions: Subscription[] = [];

  public offerList$: Subject<IOffer[]> = new Subject();
  public dialogData: IDialogData = {
    results: [],
    filter: {
      cardTypes: [],
      cardColors: [],
      cardEditions: [],
      cardNamesInOffers: [],
      cardNameSearch: null,
      cardTextSearch: null
    }
  };

  constructor(private _snackBar: MatSnackBar,
              private _salesService: SalesService,
              private _salesFilterDialogService: SalesFilterDialogService) {
    this._salesService.getAllOffers()
      .then((res: IOffer[]) => {
        this.offerList$.next(res);
      })
  }

	ngOnInit(): void {
    this._subscriptions.push(
      this._salesFilterDialogService.dialogData$
        .subscribe((res: IDialogData) => {
          this.dialogData = res;
          this.offerList$.next(res.results);
        })
    );
    this._salesService.getAllUsedFilterValues()
    .then((res: IFilter) => {
      this.dialogData.filter = res;
    })
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  openFilterDialog() {
    this._salesFilterDialogService.open(this.dialogData);
  }

  filterReset() {
    this._salesService.getAllOffers()
      .then((res) => {
        this.offerList$.next(res);
        this.dialogData.filter.cardTypes.forEach((element: IFilterOption) => {
          element.state = false;
        });
        this.dialogData.filter.cardColors.forEach((element: IFilterOption) => {
          element.state = false;
        });
        this.dialogData.filter.cardEditions.forEach((element: IFilterOption) => {
          element.state = false;
        });
        this.dialogData.filter.cardNameSearch = null;
        this.dialogData.filter.cardTextSearch = null;
        this.dialogData.results = [];
      })
  }

  closeSnackBar() {
    this._snackBar.dismiss();
  }

}
