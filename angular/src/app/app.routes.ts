import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

import { HomeComponent } from './home/home.component';
import { AccountCreateComponent } from './account/account-create/account-create.component';
import { AccountMenuComponent } from './account/account-menu/account-menu.component';
import { LoginComponent } from './shared/components/login/login.component';
import { OfferMenuComponent } from './offer/offer-menu/offer-menu.component';
import { SalesMenuComponent } from './sales/sales-menu/sales-menu.component';

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
    path: 'sales',
    component: SalesMenuComponent,
    data: { title: 'Angebote Suchen Menü'}
  },



];
