import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesService } from '../shared/sales.service ';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from "@angular/material/dialog";
import { DialogFilterComponent } from '../sales-filter/sales-filter.component';

@Component({
  selector: 'app-sales-search',
  templateUrl: './sales-search.component.html',
  styleUrls: ['./sales-search.component.scss']
})
export class SalesSearchComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar,
              private _salesService: SalesService,
              public filterDialog: MatDialog,
              public filterDialogRef: MatDialogRef<DialogFilterComponent>) {}

	ngOnInit(): void {}

  openFilterDialog() {
    const filterDialog = this.filterDialog.open(DialogFilterComponent, { disableClose: true, width:'100%' });
    filterDialog.afterClosed().subscribe((res) => {
      console.log(res);
    });
  }






  closeSnackBar() {
    this._snackBar.dismiss();
  }

}
