import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DocumentChange } from 'rxfire/firestore/interfaces';
import { Observable, Subject } from 'rxjs';
import { IBasket, BasketService } from '../shared/basket.service ';

@Component({
  selector: 'app-basket-confirm',
  templateUrl: './basket-confirm.component.html',
  styleUrls: ['./basket-confirm.component.scss']
})
export class BasketConfirmComponent implements OnInit, OnDestroy {

  private _basketObj: {[id: string]: IBasket[] } = {};

  public basketObj$: Subject<{[id: string]: IBasket[] }> = new Subject();
  public priceProviderTotal: {[id: string]: number } = {}
  public onChangeBasket$: Observable<DocumentChange<IBasket>[]> = new Observable();

  constructor(private _basketService: BasketService,
              private _location: Location) {}

	ngOnInit(): void {
    this.getBasket();
  }

  ngOnDestroy(): void {}

  getBasket() {
    this._basketService.getBasket()
      .then((res) => {
        this._basketObj = res;
        this.calcPriceProviderTotal();
        this.basketObj$.next(res);
      })
  }

  calcPriceProviderTotal() {
    for(let key in this._basketObj) {
      this.priceProviderTotal[key] = 0;
      this._basketObj[key].forEach((item: IBasket) => {
        this.priceProviderTotal[key]  += item.quantity * item.offerDetail.cardPrice;
      })
    }
  }

  navigateBack() {
    this._location.back();
  }

}

