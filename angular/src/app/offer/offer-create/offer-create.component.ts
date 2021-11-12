import { Component, HostListener, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OfferService } from '../shared/offer.service';
import { ICardDetails } from '../../shared/services/scryfallApi.service';
// import { SearchCardByNameComponent } from '../../shared/shared.module'

@Component({
  selector: 'app-offer-create, img[loaded]',
  templateUrl: './offer-create.component.html',
  styleUrls: ['./offer-create.component.scss']
})
export class OfferCreateComponent implements OnInit {

  public cardDetailsList: ICardDetails[] = [];
  public creatOfferisHidden: boolean = false;
  public imgIsResized: boolean = false;
  public creatOfferIcon: string = 'add';
  public form = new FormGroup({
    offerPrice: new FormControl('', [Validators.required]),
    deliveryMode: new FormControl('', [Validators.required]),
    cardAmount: new FormControl('', [Validators.required]),
    additionInfo: new FormControl('')
  });
  public deliveryModes = [{name: 'collection', description: 'Abholung'},
                          {name: 'shipping', description: 'Versand'}]
  public currentCardName: string | null = null;

  @Output() loaded = new EventEmitter();

  @HostListener('load')
  onLoad() {
    this.loaded.emit();
  }

  constructor(private elRef: ElementRef<HTMLImageElement>,
              private _offerService: OfferService,
              private _snackBar: MatSnackBar) {
    if (this.elRef.nativeElement.complete) {
      this.loaded.emit();
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

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
        .catch((error) => { console.log(error);
      });
    }
  }

  resultsChanged(elements: ICardDetails[]) {
    this.cardDetailsList = elements;
    this.currentCardName = null;
  }

  resizeImg() {
    this.imgIsResized = !this.imgIsResized;
  }

  onLoaded(cardName: string) {
    this.currentCardName = cardName;
  }

}
