import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription } from 'rxjs';
import { IDeliveryModes, IOffer, IPaymentModes, OfferService } from '../shared/services/offer.service';

@Component({
  selector: 'app-offer-update',
  templateUrl: './offer-update.component.html',
  styleUrls: ['./offer-update.component.scss']
})
export class OfferUpdateComponent implements OnDestroy {

  private _subscriptions: Subscription[] = [];
  private _offerData: any = {
    priceTotal: null,
    quantity: null,
    deliveryMode: null,
    paymentMode: null,
    additionInfo: null,
  };

  public offerList$: Subject<IOffer[]> = new Subject();
  public activeOffer: string = '';
  public form = new FormGroup({
    priceTotal: new FormControl('', [Validators.required]),
    deliveryMode: new FormControl('', [Validators.required]),
    paymentMode: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required]),
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
    this.activeOffer = value._id !== null && value._id !== undefined
                     ? value._id
                     : '';
                            console.log(this.activeOffer)
    this._offerService.getOffer(this.activeOffer)
      .then((val) => {
        if(val !== undefined && val !== null) {
          this.setFormValues(val);
        }
      })
  }

  async onSubmit(): Promise<any> {
    if(this.form.valid) {
      const data: any = {
        priceTotal: this.form.get('priceTotal')?.value,
        quantity: this.form.get('quantity')?.value,
        deliveryMode: this.form.get('deliveryMode')?.value,
        paymentMode: this.form.get('paymentMode')?.value,
        additionInfo: this.form.get('additionInfo')?.value
      }
      this._offerService.updateOffer(this.activeOffer, data)
        .then((val) => {
          if(val === true) {
            this._snackBar.open('Daten wurden erfolgreich aktualisiert');
          }
        })
    }
  }

  async deleteOffer() {
    this._offerService.deleteOffer(this.activeOffer);
  }

  setFormValues(form: any) {
    // Raw Values witout formations
    this._offerData.priceTotal = form.priceTotal;
    this._offerData.quantity = form.quantity;
    this._offerData.deliveryMode = form.deliveryMode;
    this._offerData.paymentMode = form.paymentMode;
    this._offerData.additionInfo = form.additionInfo;

    // Formatted Values for View
    this.form.setValue({
      priceTotal: form.priceTotal ?? 0,
      quantity: form.quantity ?? 0,
      deliveryMode: form.deliveryMode ?? '',
      paymentMode: form.paymentMode ?? '',
      additionInfo: form.additionInfo ?? ''
    },
    { emitEvent: false });
  }

  closeSnackBar() {
    this._snackBar.dismiss();
  }

}
