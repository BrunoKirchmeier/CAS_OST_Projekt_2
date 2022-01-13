import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentChange } from 'rxfire/firestore/interfaces';
import { Observable, Subject, Subscription } from 'rxjs';
import { IBasket, BasketService } from '../shared/basket.service ';



// Configurations
import { environment } from 'src/environments/environment';


// Libaries
// import { SMTPClient } from 'emailjs';


@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit, OnDestroy {

  private _basketObj: {[id: string]: IBasket[] } = {};
  private _subscriptions: Subscription[] = [];

  public basketObj$: Subject<{[id: string]: IBasket[] }> = new Subject();
  public priceTotal: number = 0;
  public keyCount: number = 0;
  public onChangeBasket$: Observable<DocumentChange<IBasket>[]> = new Observable();

  constructor(private _basketService: BasketService,
              private _snackBar: MatSnackBar,
              private _location: Location) {}

	ngOnInit(): void {
    this.getBasket();
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







/*

  private _smtpClient = new SMTPClient({
    user: environment.email.username,
    password: environment.email.pw,
    host: environment.email.host,
    tls: true,
  })
  */

  async sendEmail(to: string = '',
                  subject: string = '',
                  text: string = ''): Promise<Boolean> {
    const reg_message: any = {
      text: 'i hope this works',
      from: environment.email.from,
      to: 'bruno_churchi@gmx.ch',
      cc: '',
      subject: 'testing emailjs',
    };
/*
    await this._smtpClient.sendAsync(reg_message)
      .then((res: any) => {
console.log(res);
      })
*/
    return new Promise((resolve) => {
      resolve(true);
    });
  }

}

