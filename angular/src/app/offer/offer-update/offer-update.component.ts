import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { IDeliveryModes, IOffer, IPaymentModes, OfferService } from '../shared/services/offer.service';

@Component({
  selector: 'app-offer-update',
  templateUrl: './offer-update.component.html',
  styleUrls: ['./offer-update.component.scss']
})
export class OfferUpdateComponent implements OnDestroy {

  private _subscriptions: Subscription[] = [];

  public offerList$: Subject<IOffer[]> = new Subject();
  public activeOfferDetails: string = '';
  public form = new FormGroup({
    offerPrice: new FormControl('', [Validators.required]),
    deliveryMode: new FormControl('', [Validators.required]),
    paymentMode: new FormControl('', [Validators.required]),
    cardAmount: new FormControl('', [Validators.required]),
    additionInfo: new FormControl('')
  });
  public deliveryModes: Array<IDeliveryModes> = [];
  public paymentModes: Array<IPaymentModes> = [];

  constructor(private _offerService: OfferService,
              private _snackBar: MatSnackBar) {
    this.deliveryModes = this._offerService.getDeliveryModes();
    this.paymentModes = this._offerService.getPaymentModes();
  }

  ngOnInit() {
    this._subscriptions.push(
      this.offerList$
        .subscribe()
    );
    this._subscriptions.push(
      this._offerService.onChangeOwnerOffer$.
        subscribe((res) => {
          this.offerList$.next(res);
        })
    )
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  showOfferDetails(value: IOffer) {
    this.activeOfferDetails = value.cardDetails !== null && value.cardDetails !== undefined &&
                              value.cardDetails._id !== null && value.cardDetails._id !== undefined
                            ? value.cardDetails._id
                            : '';
  }

  async onSubmit(): Promise<any> {
    if(this.form.valid) {
      const unitPrice = this.form.get('offerPrice')?.value;
      const quantity = this.form.get('cardAmount')?.value;
      const deliveryMode = this.form.get('deliveryMode')?.value;
      const paymentMode = this.form.get('paymentMode')?.value;
      const additionInfo = this.form.get('additionInfo')?.value;


    }
  }

  closeSnackBar() {
    this._snackBar.dismiss();
  }

}
