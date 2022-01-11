import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { IBasket, BasketService } from '../shared/basket.service ';

@Component({
  selector: 'app-basket-manage',
  templateUrl: './basket-manage.component.html',
  styleUrls: ['./basket-manage.component.scss']
})
export class BasketManageComponent implements OnInit {

  private _basketObj: {[id: string]: IBasket[] } = {};

  public basketObj$: Subject<{[id: string]: IBasket[] }> = new Subject();
  public priceTotal: number = 0;
  public keyCount: number = 0;

  constructor(private _basketService: BasketService,
              private _snackBar: MatSnackBar) {}

	ngOnInit(): void {
    this.getBasket();
  }

  getBasket() {
    this.priceTotal = 0;
    this._basketService.getBasket()
      .then((res) => {
        this._basketObj = res;
        this.keyCount = (Object.keys(res).length) -1;
        for(let key in res) {
          res[key].forEach((item: IBasket) => {
            if(this.checkOfferAvailability(item) === true) {
              this.priceTotal += item.offerDetail.cardPrice * item.quantity;
            }
          })
        }
        this.calcPriceTotal();
        this._basketObj = res;
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

  quantityAdd(htmlItem: IBasket) {
    let node: HTMLSpanElement | null = document.querySelector<HTMLSpanElement>('.item-quantity-value[id="' + htmlItem._id + '"');
    let htmlValue: string = node?.innerText ?? '0';
    let htmlQuantity: any = parseFloat(htmlValue);
    let varItem: IBasket | undefined = this._basketObj[htmlItem.providerDetail.uid].find(obj => obj.offerId === htmlItem.offerId);
    if(varItem !== undefined &&
       node !== null &&
       htmlQuantity < varItem.offerDetail.quantity) {
      htmlQuantity++;
      node.innerHTML = htmlQuantity.toString();
    }
    node = document.querySelector<HTMLSpanElement>('.item-details-price[id="' + htmlItem._id + '"');
    if(varItem !== undefined &&
       node !== null) {
      let price = htmlQuantity * (varItem.offerDetail?.cardPrice ?? 0);
      node.innerHTML = (Math.ceil(price*20)/20).toFixed(2) + ' CHF';
    }
    if(varItem !== undefined) {
       varItem.quantity = htmlQuantity;
      this.updateItem(varItem);
    }
    this.calcPriceTotal();
  }

  quantityRemove(htmlItem: IBasket) {
    let node: HTMLSpanElement | null = document.querySelector<HTMLSpanElement>('.item-quantity-value[id="' + htmlItem._id + '"');
    let htmlValue: string = node?.innerText ?? '0';
    let htmlQuantity: number = parseFloat(htmlValue);
    let varItem: IBasket | undefined = this._basketObj[htmlItem.providerDetail.uid].find(obj => obj.offerId === htmlItem.offerId);
    if(node !== null &&
       htmlQuantity > 0) {
      htmlQuantity--;
      node.innerText = htmlQuantity.toString();
    }
    node = document.querySelector<HTMLSpanElement>('.item-details-price[id="' + htmlItem._id + '"');
    if(varItem !== undefined &&
       node !== null) {
      let price = htmlQuantity * (varItem.offerDetail?.cardPrice ?? 0);
      node.innerHTML = (Math.ceil(price*20)/20).toFixed(2) + ' CHF';
    }
    if(varItem !== undefined) {
       varItem.quantity = htmlQuantity;
    this.updateItem(varItem);
    }
    this.calcPriceTotal();
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

  removeItem(item: IBasket) {
    this._basketService.deleteItem(item._id)
    .then(() => {
      this.getBasket();
    })
  }

  updateItem(item: IBasket) {
    const index: number = this._basketObj[item.providerDetail.uid].findIndex(obj => obj.offerId === item.offerId);
    if(index >= 0) {
      this._basketObj[item.providerDetail.uid][index] = item;
      this._basketService.updateItem(item)
    }
  }

  checkOfferAvailability(item: IBasket): boolean {
    let ret: Boolean = false;
    let nodeQuantity: HTMLSpanElement | null = document.querySelector<HTMLSpanElement>('.item-quantity-value[id="' + item._id + '"');
    let htmlValue: string = nodeQuantity?.innerText ?? '0';
    let htmlQuantity: number = parseFloat(htmlValue);
    let varItem: IBasket | undefined = undefined;
    const index: number = this._basketObj[item.providerDetail.uid].findIndex(obj => obj.offerId === item.offerId);
    varItem = this._basketObj[item.providerDetail.uid][index];
    // good
    if(varItem !== undefined &&
      varItem.offerDetail.quantity >= htmlQuantity &&
      varItem.offerDetail.quantity >= varItem.quantity) {
      ret = true;
      if(nodeQuantity !== null) {
        nodeQuantity.classList.remove('item-quanitity-error');
      }
    } else if(varItem !== undefined &&
              nodeQuantity !== null) {
      nodeQuantity.classList.add('item-quanitity-error');
      nodeQuantity.innerText = varItem.offerDetail.quantity.toString();
      this._basketObj[item.providerDetail.uid][index].quantity = varItem.offerDetail.quantity;
    }
    return ret === true ? true: false;
  }

  checkBasket() {
    this._basketService.getBasket()
    .then((res) => {
      this._basketObj = res;
      let isFailed: Boolean = false;
      for(let key in res) {
        res[key].forEach((varItem: IBasket) => {
          if(this.checkOfferAvailability(varItem) === false) {
            isFailed = false;
            let dbItem: IBasket | undefined = this._basketObj[varItem.providerDetail.uid].find(obj => obj.offerId === varItem.offerId);
            let node: HTMLSpanElement | null = document.querySelector<HTMLSpanElement>('.item-details-price[id="' + dbItem?._id + '"');
            if(dbItem !== undefined &&
               node !== null) {
                let price = dbItem.quantity * (dbItem.offerDetail?.cardPrice ?? 0);
                node.innerText = (Math.ceil(price*20)/20).toFixed(2) + ' CHF';
            }
            if(dbItem !== undefined) {
              this.updateItem(dbItem);
            }
          }
        })
      }
      this.calcPriceTotal();
      if(isFailed === false){
        this._snackBar.open('Die Stückzahl mindestens eines Artikels wurde auf die maximal verfübare Menge reduziert');
          setTimeout(() => {
            this._snackBar.dismiss();
          }, 3000)
      }
    })
  }

  closeSnackBar() {
    this._snackBar.dismiss();
  }

}

