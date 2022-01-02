import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { IBasket, BasketService } from '../shared/basket.service ';

@Component({
  selector: 'app-basket-manage',
  templateUrl: './basket-manage.component.html',
  styleUrls: ['./basket-manage.component.scss']
})
export class BasketManageComponent implements OnInit, OnDestroy {

  public basketList$: Subject<IBasket[]> = new Subject();

  constructor(private _basketService: BasketService) {
    this._basketService.getBasket()
      .then((res) => {
        this.basketList$.next(res);
      })
  }

	ngOnInit(): void {}

  ngOnDestroy(): void {}

  showImgFocus(item: IBasket) {
    let nodeFocus: HTMLElement | null  = document.querySelector('.item-header-focus[id="' + item._id + '"');
    let nodeDetail: HTMLElement | null  = document.querySelector('.item-header-detail[id="' + item._id + '"');
    if(nodeFocus !== null &&
      nodeDetail !== null ) {
        nodeFocus.style.display = 'flex';
        nodeDetail.style.display = 'none';
    }
  }

  hiddeImgFocus(item: IBasket) {
    let nodeFocus: HTMLElement | null  = document.querySelector('.item-header-focus[id="' + item._id + '"');
    let nodeDetail: HTMLElement | null  = document.querySelector('.item-header-detail[id="' + item._id + '"');
    if(nodeFocus !== null &&
      nodeDetail !== null ) {
        nodeFocus.style.display = 'none';
        nodeDetail.style.display = 'flex';
    }
  }

  quantityAdd(item: IBasket) {
    let node = document.querySelector('.item-quantity-span[id="' + item._id + '"');
    let htmlValue = node?.innerHTML ?? 0;
    let htmlQuantity: number = htmlValue as number;
    let itemQuantity: number = item?.offerDetail?.quantity ?? 0;
    if(node !== null &&
       htmlQuantity < itemQuantity) {
      htmlQuantity++;
      node.innerHTML = htmlQuantity.toString();
    }
    node = document.querySelector('.item-details-price[id="' + item._id + '"');
    let price = htmlQuantity * (item.offerDetail?.cardPrice ?? 0);
    if(node !== null) {
      node.innerHTML = price.toString();
    }
  }

  quantityRemove(item: IBasket) {
    let node = document.querySelector('.item-quantity-span[id="' + item._id + '"');
    let htmlValue = node?.innerHTML ?? 0;
    let htmlQuantity: number = htmlValue as number;
    if(node !== null &&
       htmlQuantity > 0) {
      htmlQuantity--;
      node.innerHTML = htmlQuantity.toString();
    }
    node = document.querySelector('.item-details-price[id="' + item._id + '"');
    let price = htmlQuantity * (item.offerDetail?.cardPrice ?? 0);
    if(node !== null) {
      node.innerHTML = price.toString();
    }
  }


}

