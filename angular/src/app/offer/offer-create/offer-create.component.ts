import { Component, HostListener, OnInit, Output, EventEmitter, ElementRef, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IDeliveryModes, IPaymentModes, OfferService } from '../shared/services/offer.service';
import { ICardDetails } from '../../shared/services/scryfallApi.service';

@Component({
  selector: 'app-offer-create, img[loaded]',
  templateUrl: './offer-create.component.html',
  styleUrls: ['./offer-create.component.scss']
})
export class OfferCreateComponent implements OnInit, OnDestroy {

  public currentCardName: string | null = null;
  public imgIsResized: boolean = false;
  public borderActive: boolean = false;
  public form = new FormGroup({
    offerPrice: new FormControl('', [Validators.required]),
    deliveryMode: new FormControl('shipping', [Validators.required]),
    paymentMode: new FormControl('transfer', [Validators.required]),
    cardAmount: new FormControl('', [Validators.required]),
    additionInfo: new FormControl('')
  });
  public deliveryModes: Array<IDeliveryModes> = [];
  public paymentModes: Array<IPaymentModes> = [];

  @Input() cardDetailsList: ICardDetails[] = [];

  @Output() loaded = new EventEmitter();

  @HostListener('load')
  onLoad() {
    this.loaded.emit();
  }

  constructor(private _elRef: ElementRef<HTMLImageElement>,
              private _offerService: OfferService,
              private _snackBar: MatSnackBar) {
    if (this._elRef.nativeElement.complete) {
      this.loaded.emit();
    }
    this.deliveryModes = this._offerService.getDeliveryModes();
    this.paymentModes = this._offerService.getPaymentModes();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  ngOnChanges() {
    this.currentCardName = null;
    this.borderActive = false;
  }

  onSubmit(): void {
    if(this.form.valid) {
      const cardName =  this.currentCardName;
      const unitPrice = this.form.get('offerPrice')?.value;
      const quantity = this.form.get('cardAmount')?.value;
      const deliveryMode = this.form.get('deliveryMode')?.value;
      const paymentMode = this.form.get('paymentMode')?.value;
      const additionInfo = this.form.get('additionInfo')?.value;
      this._offerService.createOffer({cardName: cardName,
                                      unitPrice: unitPrice,
                                      quantity: quantity,
                                      deliveryMode: deliveryMode,
                                      paymentMode: paymentMode,
                                      additionInfo: additionInfo})
        .then(() => { this._snackBar.open('Das Angebot wurde eröffnet'); })
    }
  }

  resizeImg() {
    this.imgIsResized = !this.imgIsResized;
  }

  onLoaded(cardName: string) {
    this.currentCardName = cardName;
    this.borderActive = true;
  }

  closeSnackBar() {
    this._snackBar.dismiss();
  }

}
