import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AccountService, IAccountUser } from 'src/app/account/shared/services/account.service';
import { IDeliveryMode, IOffer, IPaymentMode, OfferService } from 'src/app/offer/shared/services/offer.service';
import { SaleService } from '../shared/sale.service ';

@Component({
  selector: 'app-sales-search',
  templateUrl: './sale-offers.component.html',
  styleUrls: ['./sale-offers.component.scss']
})
export class SaleOffersComponent implements OnInit, OnDestroy {

  public cardImg: IOffer | undefined = undefined;
  public offerList$: Subject<any[]> = new Subject();
  private _deliveryModes: Array<IDeliveryMode> = [];
  private _paymentModes: Array<IPaymentMode> = [];
  private _users: Array<IAccountUser> = [];
  private _dialogDataEncoded: string = '';

  constructor(private _offerService: OfferService,
              private _saleService: SaleService,
              private _accountService : AccountService,
              private _route: ActivatedRoute,
              private _router: Router,
              private _snackBar: MatSnackBar) {
    this._deliveryModes = this._offerService.getDeliveryModes();
    this._paymentModes = this._offerService.getPaymentModes();
    this._accountService.getUsers()
      .then((res: any) => {
        this._users = res;
      });
  }

	ngOnInit(): void {
    this._dialogDataEncoded = this._route.snapshot.paramMap.get('dialogDataBase64?') ?? '';
    const cardName = this._route.snapshot.paramMap.get('cardName') ?? '';
    this._saleService.getOffersByCardName(cardName)
      .then((res: IOffer[]) => {
        const offerDetails: any[] = [];
        res.forEach((element) => {
          let offerdetail: any = element;
          offerdetail = element;
          let temp: any = this._deliveryModes.find(o2 => o2.name === element.deliveryMode) ?? {name: '', description: ''};
          offerdetail.deliveryModeDescription = temp.description;

          temp = this._paymentModes.find(o2 => o2.name === element.paymentMode) ?? {name: '', description: ''};
          offerdetail.paymentModeDescription = temp.description;

          temp = this._users.find(o2 => o2.uid === element.providerUid);
          offerdetail.providerLastName = temp?.lastName;
          offerdetail.providerFirstName = temp?.firstName;
          if(offerdetail.providerLastName === '' &&
             offerdetail.providerFirstName === '') {
              offerdetail.providerLastName = 'Anonym';
          }
          offerDetails.push(offerdetail);
        })
        this.offerList$.next(offerDetails);
        this.cardImg = res[0];
      })
  }

  ngOnDestroy(): void {}

  backToCardNameSearch() {
    this._router.navigate(['sale-card-search', this._dialogDataEncoded]);
  }

  async addToBasket(offer: IOffer) {
    let node = document.querySelector('.quantity-change-span[id="' + offer._id + '"');
    let htmlValue = node?.innerHTML ?? 0;
    let quantity: number = htmlValue as number;
    if(node !== null &&
      quantity > 0) {
      const ret = await this._saleService.addToBasket(offer._id,
                                                      quantity);
      this._snackBar.open(ret.message);
      setTimeout(() => {
        this._snackBar.dismiss();
      }, 3000)
    }
  }

  quantityAdd(offer: IOffer) {
    let node = document.querySelector('.quantity-change-span[id="' + offer._id + '"');
    let htmlValue = node?.innerHTML ?? 0;
    let quantity: number = htmlValue as number;
    if(node !== null &&
       quantity < offer.quantity) {
      quantity++;
      node.innerHTML = quantity.toString();
    }
  }

  quantityRemove(offer: IOffer) {
    let node = document.querySelector('.quantity-change-span[id="' + offer._id + '"');
    let htmlValue = node?.innerHTML ?? 0;
    let quantity: number = htmlValue as number;
    if(node !== null &&
       quantity > 0) {
      quantity--;
      node.innerHTML = quantity.toString();
    }
  }

}
