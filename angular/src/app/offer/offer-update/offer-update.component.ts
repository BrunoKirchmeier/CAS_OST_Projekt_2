import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { IOffer, OfferService } from '../shared/services/offer.service';

@Component({
  selector: 'app-offer-update',
  templateUrl: './offer-update.component.html',
  styleUrls: ['./offer-update.component.scss']
})
export class OfferUpdateComponent implements OnDestroy {

  private _subscriptions: Subscription[] = [];

  public offerList$: Subject<IOffer[]> = new Subject();

  constructor(private _offerService: OfferService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this._subscriptions.push(
      this.offerList$
        .subscribe(



        )
    );

    this._subscriptions.push(
      this._offerService.onChangeOwnerOffer$.
        subscribe((res) => {
          this.offerList$.next(res);
            console.log('NEUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU');
        })
    )
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  showOfferDetails() {
    console.log('TEST');
  }

  closeSnackBar() {
    this._snackBar.dismiss();
  }

}



// onAddOwnerOffer$
