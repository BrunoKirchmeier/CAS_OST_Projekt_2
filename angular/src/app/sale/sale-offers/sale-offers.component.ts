import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { IDeliveryMode, IOffer, IPaymentMode, OfferService } from 'src/app/offer/shared/services/offer.service';
import { IDialogData, SaleService } from '../shared/sale.service ';

@Component({
  selector: 'app-sales-search',
  templateUrl: './sale-offers.component.html',
  styleUrls: ['./sale-offers.component.scss']
})
export class SaleOffersComponent implements OnInit, OnDestroy {

  public cardImg: IOffer | undefined = undefined;
  public offerList$: Subject<any[]> = new Subject();
  public deliveryModes: Array<IDeliveryMode> = [];
  public paymentModes: Array<IPaymentMode> = [];

  public dialogData: IDialogData = {
    results: [],
    filter: {
      cardTypes: [],
      cardColors: [],
      cardEditions: [],
      cardNamesInOffers: [],
      cardNameSearch: null,
    }
  };

  constructor(private _offerService: OfferService,
              private _saleService: SaleService,
              private _route: ActivatedRoute) {
    this.deliveryModes = this._offerService.getDeliveryModes();
    this.paymentModes = this._offerService.getPaymentModes();
  }

	ngOnInit(): void {
    const cardName = this._route.snapshot.params !== undefined &&
                     this._route.snapshot.params.cardName !== undefined
                   ? this._route.snapshot.params.cardName
                   : '';
    this._saleService.getOffersByCardName(cardName)
      .then((res: IOffer[]) => {
        const offerDetails: any[] = [];
        res.forEach((element) => {
          let offerdetail: any = element;
          offerdetail = element;
          let temp: IDeliveryMode = this.deliveryModes.find(o2 => o2.name === element.deliveryMode) ?? {name: '', description: ''};
          offerdetail.deliveryModeDescription = temp.description;

          temp = this.paymentModes.find(o2 => o2.name === element.paymentMode) ?? {name: '', description: ''};
          offerdetail.paymentModeDescription = temp.description;
          offerDetails.push(offerdetail);
        })
        this.offerList$.next(offerDetails);
        this.cardImg = res[0];
      })
  }

  ngOnDestroy(): void {}

  backToCardNameSearch() {

  }


}
