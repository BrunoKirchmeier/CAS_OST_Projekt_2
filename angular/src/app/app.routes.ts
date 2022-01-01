import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

import { HomeComponent } from './home/home.component';
import { AccountCreateComponent } from './account/account-create/account-create.component';
import { AccountMenuComponent } from './account/account-menu/account-menu.component';
import { LoginComponent } from './shared/components/login/login.component';
import { OfferMenuComponent } from './offer/offer-menu/offer-menu.component';
import { SaleCardSearchComponent } from './sale/sale-card-search/sale-card-search.component';
import { SaleOffersComponent } from './sale/sale-offers/sale-offers.component';
import { BasketManageComponent } from './basket/basket-manage/basket-manage.component';


export const appRoutes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home'}
  },
  {
    path: 'register',
    component: AccountCreateComponent,
    data: { title: 'Account'}
  },
  {
    path: 'account-settings',
    component: AccountMenuComponent, canActivate: [AuthGuard],
    data: { title: 'Account Update'}
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'offer',
    component: OfferMenuComponent, canActivate: [AuthGuard],
    data: { title: 'Angebote Erstellen Menü'}
  },
  {
    path: 'sale-card-search',
    component: SaleCardSearchComponent,
    data: { title: 'Karten Suchen'}
  },
  {
    path: 'sale-offers/:cardName',
    component: SaleOffersComponent,
    data: { title: 'Angebote Suchen'}
  },
  {
    path: 'basket',
    component: BasketManageComponent,
    data: { title: 'Warenkorb'}
  },
];
