import { Component, OnInit } from '@angular/core';
import { ICardDetails } from '../../shared/services/scryfallApi.service';

@Component({
  selector: 'app-offer-menue',
  templateUrl: './offer-menue.component.html',
  styleUrls: ['./offer-menue.component.scss']
})
export class OfferMenueComponent implements OnInit {

  public cardDetailsList: ICardDetails[] = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  resultsChanged(elements: ICardDetails[]) {
    this.cardDetailsList = elements;
  }

}
