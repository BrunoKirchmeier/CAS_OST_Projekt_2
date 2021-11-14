import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

import { HomeComponent } from './home/home.component';
import { AccountCreateComponent } from './account/account-create/account-create.component';
import { LoginComponent } from './shared/components/login/login.component';
import { OfferMenueComponent } from './offer/offer-menue/offer-menue.component';

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
    path: 'offer',
    component: OfferMenueComponent, canActivate: [AuthGuard],
    data: { title: 'Angebote Menue'}
  },
];
