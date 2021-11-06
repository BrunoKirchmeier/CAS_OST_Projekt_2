import { Component, HostListener, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatabaseService } from 'src/app/shared/database/services/database.service';
import { ICardDetails } from '../../shared/scryfallApi/services/scryfallApi.service';


@Component({
  selector: 'app-offer-create, img[loaded]',
  templateUrl: './offer-create.component.html',
  styleUrls: ['./offer-create.component.scss']
})
export class OfferCreateComponent implements OnInit {

 ////////////////////////////////////////////////////////////////////////////////////////////////
  // Declarations
  ////////////////////////////////////////////////////////////////////////////////////////////////

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

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(private elRef: ElementRef<HTMLImageElement>,
              private _db: DatabaseService,
              private _snackBar: MatSnackBar) {
    if (this.elRef.nativeElement.complete) {
      this.loaded.emit();
    }
  }

  ngOnInit(): void {}

/*
  ngOnInit(): void {
    this._db.onChangeOffer$
      .subscribe({ next: (data: any) => { console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'); console.log(data); }});
  }
*/
  ngOnDestroy(): void {}


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Form Search (Search Option for API Request to Scryfall)
  ////////////////////////////////////////////////////////////////////////////////////////////////

  onSubmit(): void {
    if(this.form.valid) {
      const cardName =  this.currentCardName;
      const unitPrice = this.form.get('offerPrice')?.value;
      const quantity = this.form.get('cardAmount')?.value;
      const deliveryMode = this.form.get('deliveryMode')?.value;
      const additionInfo = this.form.get('additionInfo')?.value;
      this._db.createOffer({cardName: cardName,
                            unitPrice: unitPrice,
                            quantity: quantity,
                            deliveryMode: deliveryMode,
                            additionInfo: additionInfo})
        .then((res) => { this._snackBar.open('Das Angebot wurde eröffnet'); console.log(res); })
        .catch((error) => { console.log(error);
      });
    }
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Event functions
  ////////////////////////////////////////////////////////////////////////////////////////////////

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
