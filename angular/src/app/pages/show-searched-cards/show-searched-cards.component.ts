import { Component, OnInit } from '@angular/core';
import { ICardDetails } from '../../api/api-scryfall.service';

@Component({
  selector: 'app-show-searched-cards',
  templateUrl: './show-searched-cards.component.html',
  styleUrls: ['./show-searched-cards.component.scss']
})
export class ShowSearchedCardsComponent implements OnInit {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Declarations
  ////////////////////////////////////////////////////////////////////////////////////////////////

  public cardDetailsList: ICardDetails[] = [];
  public creatOfferisHidden: boolean = false;
  public creatOfferIcon: string = 'add';

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Event functions
  ////////////////////////////////////////////////////////////////////////////////////////////////

  resultsChanged(elements: ICardDetails[]) {
    this.cardDetailsList = elements;
  }

  createOffer() {
    this.creatOfferisHidden = !this.creatOfferisHidden;
    this.creatOfferIcon = this.creatOfferisHidden === false
                        ? 'add'
                        : 'clear';
  }



}
