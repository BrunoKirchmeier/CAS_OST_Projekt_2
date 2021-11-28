import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IOffer, OfferService } from '../shared/services/offer.service';

@Component({
  selector: 'app-offer-update',
  templateUrl: './offer-update.component.html',
  styleUrls: ['./offer-update.component.scss']
})
export class OfferUpdateComponent implements OnInit {

  public offerList: Array<IOffer> = [];

  constructor(private _offerService: OfferService,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {}



  closeSnackBar() {
    this._snackBar.dismiss();
  }

}
