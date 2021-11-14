import { Component, OnInit } from '@angular/core';
import { ICardDetails } from '../../shared/services/scryfallApi.service';

@Component({
  selector: 'app-offer-menue',
  templateUrl: './offer-menu.component.html',
  styleUrls: ['./offer-menu.component.scss']
})
export class OfferMenuComponent implements OnInit {

  public cardDetailsList: ICardDetails[] = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  resultsChanged(elements: ICardDetails[]) {
    this.cardDetailsList = elements;
  }

}
