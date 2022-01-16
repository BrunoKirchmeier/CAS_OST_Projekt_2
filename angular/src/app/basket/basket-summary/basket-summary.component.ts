import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DocumentChange } from 'rxfire/firestore/interfaces';
import { Observable, Subject } from 'rxjs';
import { IBasket, BasketService } from '../shared/basket.service ';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit, OnDestroy {

  private _basketObj: {[id: string]: IBasket[] } = {};

  public basketObj$: Subject<{[id: string]: IBasket[] }> = new Subject();
  public priceTotal: number = 0;
  public keyCount: number = 0;
  public onChangeBasket$: Observable<DocumentChange<IBasket>[]> = new Observable();

  constructor(private _basketService: BasketService,
              private _router: Router,
              private _location: Location) {}

	ngOnInit(): void {
    this.getBasket();
    this._basketService.onChangeBasket$.subscribe((docs: DocumentChange<IBasket>[]) => {
      docs.forEach((docs: DocumentChange<IBasket>) => {
        // Update singel data on xhange Basket
        const basketItem: IBasket = docs.doc.data();
        if(this._basketObj !== undefined &&
          this._basketObj[basketItem.providerDetail.uid] !== undefined ) {
            let index = this._basketObj[basketItem.providerDetail.uid].findIndex((item => item._id === basketItem._id));
            if(basketItem.providerDetail?.lastName == '' &&
              basketItem.providerDetail?.firstName == '') {
              basketItem.providerDetail.lastName = 'Anonym';
            }
            if(basketItem.providerDetail?.zip == '') {
              basketItem.providerDetail.city = 'Wohnort Unbekannt';
            }
            this._basketObj[basketItem.providerDetail.uid][index] = basketItem;
            this.basketObj$.next(this._basketObj);
        }
      })
    })
  }

  ngOnDestroy(): void {}

  getBasket() {
    this.priceTotal = 0;
    this._basketService.getBasket()
      .then((res) => {
        this._basketObj = res;
        this.calcPriceTotal();
        this.basketObj$.next(res);
      })
  }

  calcPriceTotal() {
    this.priceTotal = 0;
    this.keyCount = (Object.keys(this._basketObj).length) -1;
    for(let key in this._basketObj) {
      this._basketObj[key].forEach((item: IBasket) => {
        this.priceTotal += item.quantity * item.offerDetail.cardPrice;
      })
    }
  }

  updateItem(item: IBasket) {
    const index: number = this._basketObj[item.providerDetail.uid].findIndex(obj => obj.offerId === item.offerId);
    if(index >= 0) {
      this._basketObj[item.providerDetail.uid][index] = item;
      this._basketService.updateItem(item)
    }
  }

  navigateBack() {
    this._location.back();
  }

  sendEmail(): void {
    for(let key in this._basketObj) {
      this._basketService.confirmBasket(this._basketObj[key]);
    }
    this._router.navigate(['/basket-confirm']);

  }

}

