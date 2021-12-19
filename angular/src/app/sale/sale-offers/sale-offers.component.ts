import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { IOffer } from 'src/app/offer/shared/services/offer.service';
import { IDialogData, SaleService } from '../shared/sale.service ';

@Component({
  selector: 'app-sales-search',
  templateUrl: './sale-offers.component.html',
  styleUrls: ['./sale-offers.component.scss']
})
export class SaleOffersComponent {

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

  constructor(private _snackBar: MatSnackBar,
              private _saleService: SaleService,
              private _router: Router) {


/*
    this._saleService.getOffersByCardName()
      .then((res: IOffer[]) => {
        this.offerList$.next(res);
        console.log(res);
      })
      */
  }

}
