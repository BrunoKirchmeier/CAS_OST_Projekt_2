import { RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { HomeComponent } from '../../home/home.component';
import { AccountCreateComponent } from '../../account/account-create/account-create.component';
import { LoginComponent } from './login/login.component';
import { OfferCreateComponent } from '../../offer/offer-create/offer-create.component';
import { OfferSearchComponent } from '../../offer/offer-search/offer-search.component';

const authRoutes = [

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

export const authRoutesModule = RouterModule.forChild(authRoutes);
