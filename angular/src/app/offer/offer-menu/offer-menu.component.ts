import { Component } from '@angular/core';
import { ICardDetails } from '../../shared/services/scryfallApi.service';

@Component({
  selector: 'app-offer-menue',
  templateUrl: './offer-menu.component.html',
  styleUrls: ['./offer-menu.component.scss']
})
export class OfferMenuComponent {

  public cardDetails: any;

  resultsChanged(elements: ICardDetails[]) {
    this.cardDetails = elements;
  }

}
