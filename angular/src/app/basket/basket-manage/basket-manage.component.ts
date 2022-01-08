import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { IBasket, BasketService } from '../shared/basket.service ';

@Component({
  selector: 'app-basket-manage',
  templateUrl: './basket-manage.component.html',
  styleUrls: ['./basket-manage.component.scss']
})
export class BasketManageComponent implements OnInit, OnDestroy {

  public basketObj$: Subject<{[id: string]: IBasket[] }> = new Subject();
  public priceTotal: number = 0;
  public keyCount: number = 0;

  constructor(private _basketService: BasketService) {
    this.getBasket();
  }

	ngOnInit(): void {}

  ngOnDestroy(): void {}

  getBasket() {
    this.priceTotal = 0;
    this._basketService.getBasket()
    .then((res) => {
      this.keyCount = (Object.keys(res).length) -1;
      for(let key in res) {
        res[key].forEach((item: IBasket) => {
          if(this.checkOfferAvailability(item) === true) {
            this.priceTotal += item.offerDetail.cardPrice * item.quantity;
          } else {
            item.quantity = item.offerDetail.quantity;
            this.updateItem(item);
          }
          if(item.providerDetail?.lastName == '' &&
          item.providerDetail?.firstName == '') {
            item.providerDetail.lastName = 'Anonym';
          }
        })
      }
      this.basketObj$.next(res);
    })
  }

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
    let node: HTMLSpanElement | null = document.querySelector<HTMLSpanElement>('.item-quantity-value[id="' + item._id + '"');
    let htmlValue: string = node?.innerText ?? '0';
    let htmlQuantity: any = parseFloat(htmlValue);
    let itemQuantity: number = item?.offerDetail?.quantity ?? 0;
    if(node !== null &&
       htmlQuantity < itemQuantity) {
      htmlQuantity++;
      node.innerHTML = htmlQuantity.toString();
    }
    node = document.querySelector<HTMLSpanElement>('.item-details-price[id="' + item._id + '"');
    let price = htmlQuantity * (item.offerDetail?.cardPrice ?? 0);
    if(node !== null) {
      node.innerHTML = (Math.ceil(price*20)/20).toFixed(2) + ' CHF';
    }
    item.quantity = htmlQuantity;
    this.updateItem(item);
    this.reRenderingPriceTotal();
  }

  quantityRemove(item: IBasket) {
    let node: HTMLSpanElement | null = document.querySelector<HTMLSpanElement>('.item-quantity-value[id="' + item._id + '"');
    let htmlValue: string = node?.innerText ?? '0';
    let htmlQuantity: number = parseFloat(htmlValue);
    if(node !== null &&
       htmlQuantity > 0) {
      htmlQuantity--;
      node.innerText = htmlQuantity.toString();
    }
    node = document.querySelector<HTMLSpanElement>('.item-details-price[id="' + item._id + '"');
    let price = htmlQuantity * (item.offerDetail?.cardPrice ?? 0);
    if(node !== null) {
      node.innerText = (Math.ceil(price*20)/20).toFixed(2) + ' CHF';
    }
    item.quantity = htmlQuantity;
    this.updateItem(item);
    this.reRenderingPriceTotal();
  }

  reRenderingPriceTotal() {
    this.priceTotal = 0;
    let nodeListPrices = document.querySelectorAll<HTMLSpanElement>('.item-details-price');
    nodeListPrices.forEach((node: HTMLSpanElement ) => {
      let htmlValue: string = node?.innerText ?? '0';
      let htmlQuantity: number = parseFloat(htmlValue);
      this.priceTotal += htmlQuantity;
    });
  }

  removeItem(item: IBasket) {
    this._basketService.deleteItem(item._id)
    .then(() => {
      this.getBasket();
    })
  }

  updateItem(item: IBasket) {
    this._basketService.updateItem(item)
  }

  checkOfferAvailability(item: IBasket): any {
    let ret: Boolean = false;
    let nodeQuantity: HTMLSpanElement | null = document.querySelector<HTMLSpanElement>('.item-quantity-value[id="' + item._id + '"');
    let htmlValue: string = nodeQuantity?.innerText ?? '0';
    let htmlQuantity: number = parseFloat(htmlValue);
    // good
    if(item.offerDetail.quantity >= htmlQuantity &&
        item.offerDetail.quantity >= item.quantity) {
      ret = true;
    } else if(nodeQuantity !== null) {
      nodeQuantity.innerText = item.offerDetail.quantity.toString();
      let nodeItem: HTMLDivElement | null = document.querySelector<HTMLDivElement>('.item-details[id="' + item._id + '"');
      if(nodeItem !== null) {
        nodeItem.style.color = 'red';
      }
    }
    return ret;
  }

}

