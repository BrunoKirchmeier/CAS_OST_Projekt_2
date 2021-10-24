import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShowSearchedCardsComponent } from './pages/show-searched-cards/show-searched-cards.component';
import { CreateOfferComponent } from './pages/create-offer/create-offer.component';
import { SearchOffersComponent } from './pages/search-offers/search-offers.component';

export const appRoutes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home'}
  },
  {
    path: 'show-search-card',
    component: ShowSearchedCardsComponent,
    data: { title: 'Kartensuche'}
  },
  {
    path: 'create-offer',
    component: CreateOfferComponent,
    data: { title: 'Angebt erstellen'}
  },
  {
    path: 'search-offers',
    component: SearchOffersComponent,
    data: { title: 'Angebotssuche'}
  }

  /*
  {
    path: 'todo',
    loadChildren: () => import('./todo/todo.module').then(m => m.TodoAdvancedRoutingModule),
    data: { title: 'Advanced Routing' }
  }
  */
];
