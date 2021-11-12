import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

import { HomeComponent } from './home/home.component';
import { AccountCreateComponent } from './account/account-create/account-create.component';
import { LoginComponent } from './shared/components/login/login.component';
import { OfferCreateComponent } from './offer/offer-create/offer-create.component';
import { OfferSearchComponent } from './offer/offer-search/offer-search.component';

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
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'offer-create',
    component: OfferCreateComponent, canActivate: [AuthGuard],
    data: { title: 'Angebot erstellen'}
  },
  {
    path: 'offer-search',
    component: OfferSearchComponent,
    data: { title: 'Angebotssuche'}
  }
];
