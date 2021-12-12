import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { DialogFilterComponent } from '../sales-filter/sales-filter.component';
import { IDialogData } from './sales.service ';

@Injectable()
export class SalesFilterDialogService implements OnDestroy {

  private _subscriptions: Subscription[] = [];
  private _dialogData: IDialogData = {results: [], filter: { cardTypes: [],
                                                             cardColors: [],
                                                             cardEditions: [],
                                                             cardNamesInOffers: [],
                                                             cardNameSearch: null,
                                                             cardTextSearch: null,
   }};

  public dialogData$: Subject<IDialogData> = new Subject();

  constructor(private _filterDialog: MatDialog,
              private _filterDialogRef: MatDialogRef<DialogFilterComponent>) {}

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  open(dialogData: IDialogData): void {
    this._dialogData = dialogData;
    this._filterDialogRef = this._filterDialog.open(DialogFilterComponent, { disableClose: true, width:'100%', data: dialogData});
    this._subscriptions.push(
      this._filterDialogRef.afterOpened()
        .subscribe(() => {
          this.dialogData$.next(this._dialogData);
        })
    );
    this._subscriptions.push(
      this._filterDialogRef.afterClosed()
        .subscribe((res: IDialogData) => {
          this.dialogData$.next(res);
        })
    );
  }

}