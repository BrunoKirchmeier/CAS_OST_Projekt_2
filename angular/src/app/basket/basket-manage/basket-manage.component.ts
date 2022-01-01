import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AccountService, IAccountUser } from 'src/app/account/shared/services/account.service';
import { IBasketData, BasketService } from '../shared/basket.service ';

@Component({
  selector: 'app-sales-search',
  templateUrl: './basket-manage.component.html',
  styleUrls: ['./basket-manage.component.scss']
})
export class BasketManageComponent implements OnInit, OnDestroy {


  constructor() {
  }

	ngOnInit(): void {

  }

  ngOnDestroy(): void {}

}
