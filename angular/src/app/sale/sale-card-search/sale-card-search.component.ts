import { Component, OnDestroy, OnInit } from '@angular/core';
import { IDialogData, SaleService } from '../shared/sale.service ';
import { Subject, Subscription } from 'rxjs';
import { IOffer } from 'src/app/offer/shared/services/offer.service';
import { SaleFilterDialogService } from '../shared/sale-filter-dialog.service';
import { IFilter, IFilterOption } from 'src/app/shared/services/scryfallApi.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sales-search',
  templateUrl: './sale-card-search.component.html',
  styleUrls: ['./sale-card-search.component.scss']
})
export class SaleCardSearchComponent implements OnInit, OnDestroy {

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
    }
  };

  constructor(private _saleService: SaleService,
              private _saleFilterDialogService: SaleFilterDialogService,
              private _route: ActivatedRoute,
              private _router: Router) {
    try {
      const dialogDataBase64 = this._route.snapshot.paramMap.get('dialogDataBase64?') ?? '';
      this.dialogData = JSON.parse(decodeURI(atob(dialogDataBase64)));
      this._saleService.getOffersByFilter(this.dialogData.filter)
      .then((res) => {
        this.dialogData.results = res;
        this.offerList$.next(res);
       }
     )
    } catch(err) {
      this._saleService.getAllUsedFilterValues()
      .then((res: IFilter) => {
        this.dialogData.filter = res;
      })
      this._saleService.getAllOffers()
      .then((res: IOffer[]) => {
        this.offerList$.next(res);
      })
    }
  }

	ngOnInit(): void {
    this._subscriptions.push(
      this._saleFilterDialogService.dialogData$
        .subscribe((res: IDialogData) => {
          this.dialogData = res;
          this.offerList$.next(res.results);
        })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  openFilterDialog() {
    this._saleFilterDialogService.open(this.dialogData);
  }

  filterReset() {
    this._saleService.getAllOffers()
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
        this.dialogData.results = res;
      })
  }

  getAllOffersForCard(cardName: string) {
    const dialogDataBase64 = btoa(encodeURI(JSON.stringify(this.dialogData)));
    this._router.navigate(['sale-offers/', cardName, dialogDataBase64]);
  }

}
