import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription } from 'rxjs';
import { IDeliveryMode, IOffer, IPaymentMode, OfferService } from '../shared/services/offer.service';
import { CHFValidator, IntValidator } from '../../shared/helpers/form-validators';

@Component({
  selector: 'app-offer-update',
  templateUrl: './offer-update.component.html',
  styleUrls: ['./offer-update.component.scss']
})
export class OfferUpdateComponent implements OnDestroy {

  private _subscriptions: Subscription[] = [];
  private _offerData: any = {
    cardPrice: null,
    quantity: null,
    deliveryMode: null,
    paymentMode: null,
    additionInfo: null,
  };

  public offerList$: Subject<IOffer[]> = new Subject();
  public activeOffer: string = '';
  public form = new FormGroup({
    cardPrice: new FormControl('', [Validators.required, CHFValidator()]),
    deliveryMode: new FormControl('', [Validators.required]),
    paymentMode: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required, IntValidator()]),
    additionInfo: new FormControl('')
  });
  public deliveryModes: Array<IDeliveryMode> = [];
  public paymentModes: Array<IPaymentMode> = [];

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
    this._offerService.getMyOffers()
      .then((res) => {
        this.offerList$.next(res);
      })
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
    this._offerService.getOffer(this.activeOffer)
      .then((val) => {
        if(val !== undefined && val !== null) {
          this.setFormValues(val);
        }
      })
  }

  async onSubmit(): Promise<any> {
    if(this.form.valid) {
      let cardPrice: number = this.form.get('cardPrice')?.value ?? 0;
      let quantity: number = this.form.get('quantity')?.value ?? 0;
      const data: any = {
        cardPrice: Math.ceil(cardPrice*20)/20,
        quantity: Math.round(quantity),
        deliveryMode: this.form.get('deliveryMode')?.value,
        paymentMode: this.form.get('paymentMode')?.value,
        additionInfo: this.form.get('additionInfo')?.value
      }
      this._offerService.updateOffer(this.activeOffer, data)
        .then((val) => {
          if(val === true) {
            this._snackBar.open('Daten wurden erfolgreich aktualisiert');
            setTimeout(() => {
              this._snackBar.dismiss();
            }, 3000)
          }
        })
    }
  }

  async deleteOffer() {
    this._offerService.deleteOffer(this.activeOffer);
  }

  setFormValues(form: any) {
    // Raw Values witout formations
    this._offerData.cardPrice = form.cardPrice;
    this._offerData.quantity = form.quantity;
    this._offerData.deliveryMode = form.deliveryMode;
    this._offerData.paymentMode = form.paymentMode;
    this._offerData.additionInfo = form.additionInfo;

    // Formatted Values for View
    this.form.setValue({
      cardPrice: form.cardPrice ?? 0,
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
