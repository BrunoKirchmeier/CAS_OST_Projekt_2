import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { IOffer } from 'src/app/offer/shared/services/offer.service';
import { DialogFilterComponent } from '../sale-filter/sale-filter.component';
import { IDialogData, SaleService } from './sale.service ';

@Injectable()
export class SaleFilterDialogService implements OnDestroy {

  private _subscriptions: Subscription[] = [];
  private _dialogData: IDialogData = {results: [], filter: { cardTypes: [],
                                                             cardColors: [],
                                                             cardEditions: [],
                                                             cardNamesInOffers: [],
                                                             cardNameSearch: null,
   }};

  public dialogData$: Subject<IDialogData> = new Subject();

  constructor(private _filterDialog: MatDialog,
              private _filterDialogRef: MatDialogRef<DialogFilterComponent>,
              private _saleService: SaleService) {}

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  open(dialogData: IDialogData): void {
    this._dialogData = dialogData;

    if(dialogData.results.length === 0) {
      this._saleService.getAllOffers()
      .then((res: IOffer[]) => {
        this._dialogData.results = res;
        this.dialogData$.next(this._dialogData);
      });
    }

    this._filterDialogRef = this._filterDialog.open(DialogFilterComponent, { disableClose: true, width:'100%', data: dialogData});
    this._subscriptions.push(
      this._filterDialogRef.afterClosed()
        .subscribe((res: IDialogData) => {
          this.dialogData$.next(res);
        })
    );
  }
}
