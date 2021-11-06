import { Routes } from '@angular/router';
import { AuthGuard } from './shared/auth/auth.guard';

import { HomeComponent } from './home/home.component';
import { OfferCreateComponent } from './offer/offer-create/offer-create.component';
import { OfferSearchComponent } from './offer/offer-search/offer-search.component';
import { SearchCardComponent } from './shared/search-card/search-card.component';
import { LoginComponent } from './shared/auth/login.component';
import { AccountComponent } from './account/account-create.component';



export const appRoutes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full'},

  { path: 'login',
    component: LoginComponent },
  {
    path: 'register',
    component: AccountComponent,
    data: { title: 'Account'}
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home'}
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
  },
  {
    path: 'test',
    component: SearchCardComponent,
    data: { title: 'TEST'}
  }

  /*
  {
    path: 'todo',
    loadChildren: () => import('./todo/todo.module').then(m => m.TodoAdvancedRoutingModule),
    data: { title: 'Advanced Routing' }
  }
  */
];
