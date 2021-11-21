import { Component, HostListener, OnInit, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OfferService } from '../shared/services/offer.service';
import { ICardDetails } from '../../shared/services/scryfallApi.service';

@Component({
  selector: 'app-offer-create, img[loaded]',
  templateUrl: './offer-create.component.html',
  styleUrls: ['./offer-create.component.scss']
})
export class OfferCreateComponent implements OnInit {

  public currentCardName: string | null = null;
  public imgIsResized: boolean = false;
  public borderActive: boolean = false;
  public form = new FormGroup({
    offerPrice: new FormControl('', [Validators.required]),
    deliveryMode: new FormControl('', [Validators.required]),
    cardAmount: new FormControl('', [Validators.required]),
    additionInfo: new FormControl('')
  });
  public deliveryModes = [{name: 'collection', description: 'Abholung'},
                          {name: 'shipping', description: 'Versand'}]

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
      const additionInfo = this.form.get('additionInfo')?.value;
      this._offerService.createOffer({cardName: cardName,
                                      unitPrice: unitPrice,
                                      quantity: quantity,
                                      deliveryMode: deliveryMode,
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

}
