import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesService } from '../shared/sales.service ';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from "@angular/material/dialog";
import { DialogFilterComponent } from '../sales-filter/sales-filter.component';
import { Subject } from 'rxjs';
import { IOffer } from 'src/app/offer/shared/services/offer.service';

@Component({
  selector: 'app-sales-search',
  templateUrl: './sales-search.component.html',
  styleUrls: ['./sales-search.component.scss']
})
export class SalesSearchComponent implements OnInit {

  public offerList$: Subject<IOffer[]> = new Subject();

  constructor(private _snackBar: MatSnackBar,
              private _salesService: SalesService,
              public filterDialog: MatDialog,
              public filterDialogRef: MatDialogRef<DialogFilterComponent>) {
    this._salesService.getAllOffers()
      .then((res) => { this.offerList$.next(res); })
  }

	ngOnInit(): void {}

  openFilterDialog() {
    const filterDialog = this.filterDialog.open(DialogFilterComponent, { disableClose: true, width:'100%' });
    filterDialog.afterClosed().subscribe((res) => {
      this.offerList$.next(res);
    });
  }

  filterReset() {
    this._salesService.getAllOffers()
      .then((res) => { this.offerList$.next(res); })
  }





  closeSnackBar() {
    this._snackBar.dismiss();
  }

}
