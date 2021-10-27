import { Component, HostListener, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICardDetails } from '../../modules/scryfallApi/services/scryfallApi.service';


@Component({
  selector: 'app-create-offer, img[loaded]',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.scss']
})
export class CreateOfferComponent implements OnInit {

 ////////////////////////////////////////////////////////////////////////////////////////////////
  // Declarations
  ////////////////////////////////////////////////////////////////////////////////////////////////

  public cardDetailsList: ICardDetails[] = [];
  public creatOfferisHidden: boolean = false;
  public imgIsResized: boolean = false;
  public creatOfferIcon: string = 'add';
  public offerForm = new FormGroup({
    offerPrice: new FormControl('', [Validators.required]),
    deliveryMode: new FormControl('', [Validators.required]),
    cardAmount: new FormControl('', [Validators.required]),
    additionInfo: new FormControl('')
  });
  public deliveryModes = [{name: 'collection', description: 'Abholung'},
                          {name: 'shipping', description: 'Versand'}]
  public imgIsloaded: Boolean = false;

  @Output() loaded = new EventEmitter();

  @HostListener('load')
  onLoad() {
    this.loaded.emit();
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(private elRef: ElementRef<HTMLImageElement>) {
    if (this.elRef.nativeElement.complete) {
      this.loaded.emit();
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Form Search (Search Option for API Request to Scryfall)
  ////////////////////////////////////////////////////////////////////////////////////////////////

  onSubmit(): void {
    console.log('TEST');
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Event functions
  ////////////////////////////////////////////////////////////////////////////////////////////////

  resultsChanged(elements: ICardDetails[]) {
    this.cardDetailsList = elements;
    this.imgIsloaded = false;
  }

  resizeImg() {
    this.imgIsResized = !this.imgIsResized;
  }

  onLoaded() {
    this.imgIsloaded = true;
  }

}
