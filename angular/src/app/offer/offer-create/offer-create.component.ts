import { Component, OnChanges, HostListener, Output, EventEmitter, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IDeliveryModes, IPaymentModes, OfferService } from '../shared/services/offer.service';
import { ApiScryfallService, ICardDetails } from '../../shared/services/scryfallApi.service';
@Component({
  selector: 'app-offer-create, img[loaded]',
  templateUrl: './offer-create.component.html',
  styleUrls: ['./offer-create.component.scss']
})
export class OfferCreateComponent implements OnChanges {

  @ViewChild('formDirective') formDirective: any;

  public currentCardName: string | null = null;
  public imgIsResized: boolean = false;
  public borderActive: boolean = false;
  public form = new FormGroup({
    priceTotal: new FormControl('', [Validators.required]),
    deliveryMode: new FormControl('', [Validators.required]),
    paymentMode: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required]),
    additionInfo: new FormControl('')
  });
  public deliveryModes: Array<IDeliveryModes> = [];
  public paymentModes: Array<IPaymentModes> = [];

  @Input() cardDetails: any = null;

  @Output() loaded = new EventEmitter();

  @HostListener('load')
  onLoad() {
    this.loaded.emit();
  }

  constructor(private _elRef: ElementRef<HTMLImageElement>,
              private _offerService: OfferService,
              private _snackBar: MatSnackBar,
              private _scryfall: ApiScryfallService) {
    if (this._elRef.nativeElement.complete) {
      this.loaded.emit();
    }
    this.deliveryModes = this._offerService.getDeliveryModes();
    this.paymentModes = this._offerService.getPaymentModes();
  }

  ngOnChanges() {
    this.currentCardName = null;
    this.borderActive = false;
  }

  async onSubmit(): Promise<any> {
    if(this.form.valid) {
      const cardName =  this.currentCardName as string;
      const priceTotal = this.form.get('priceTotal')?.value;
      const quantity = this.form.get('quantity')?.value;
      const deliveryMode = this.form.get('deliveryMode')?.value;
      const paymentMode = this.form.get('paymentMode')?.value;
      const additionInfo = this.form.get('additionInfo')?.value;
      const cardDetails: ICardDetails = await this._scryfall.getCardDetailsByName(cardName);
      this._offerService.createOffer({cardName: cardName,
                                      priceTotal: priceTotal,
                                      quantity: quantity,
                                      deliveryMode: deliveryMode,
                                      paymentMode: paymentMode,
                                      additionInfo: additionInfo,
                                      cardDetails: cardDetails
                                    })
        .then(() => {
          this.formDirective.resetForm();
          this._snackBar.open('Das Angebot wurde eröffnet');
        })
    }
  }

  onLoaded(cardName: string) {
    this.currentCardName = cardName;
    this.borderActive = true;
  }

  closeSnackBar() {
    this._snackBar.dismiss();
  }

}
