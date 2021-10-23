import { Routes } from '@angular/router';
import { CardSearchComponent } from './pages/card-search/card-search.component';
import { HomeComponent } from './pages/home/home.component';

export const appRoutes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home'}
  },
  {
    path: 'card-search',
    component: CardSearchComponent,
    data: { title: 'Kartensuche'}
  }

  /*
  {
    path: 'todo',
    loadChildren: () => import('./todo/todo.module').then(m => m.TodoAdvancedRoutingModule),
    data: { title: 'Advanced Routing' }
  }
  */
];
