import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

import { HomeComponent } from './modules/home/home.component';
import { ShowSearchedCardsComponent } from './pages/show-searched-cards/show-searched-cards.component';
import { CreateOfferComponent } from './pages/create-offer/create-offer.component';
import { SearchOffersComponent } from './pages/search-offers/search-offers.component';
import { SearchCardComponent } from './shared/search-card/search-card.component';
import { LoginComponent } from './core/login/login.component';
import { AccountComponent } from './modules/account/account-create.component';



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
    path: 'show-searched-cards',
    component: ShowSearchedCardsComponent,
    data: { title: 'Kartensuche'}
  },
  {
    path: 'create-offer',
    component: CreateOfferComponent, canActivate: [AuthGuard],
    data: { title: 'Angebot erstellen'}
  },
  {
    path: 'search-offers',
    component: SearchOffersComponent,
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
