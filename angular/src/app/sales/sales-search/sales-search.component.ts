import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sales-search',
  templateUrl: './sales-search.component.html',
  styleUrls: ['./sales-search.component.scss']
})
export class SalesSearchComponent {


  constructor(private _snackBar: MatSnackBar) {}





  closeSnackBar() {
    this._snackBar.dismiss();
  }

}
