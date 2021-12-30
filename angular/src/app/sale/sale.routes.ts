import { RouterModule } from '@angular/router';

import { SaleCardSearchComponent } from './sale-card-search/sale-card-search.component';
import { SaleOffersComponent } from './sale-offers/sale-offers.component';

const salesRoutes = [

  { path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'sale-card-search/:dialogDataBase64?',
    component: SaleCardSearchComponent,
    data: { title: 'Karte suchen'}
  },
  {
    path: 'sale-offers/:cardName/:dialogDataBase64?',
    component: SaleOffersComponent,
    data: { title: 'Angebote suchen'}
  },
];

export const salesRoutesModule = RouterModule.forChild(salesRoutes);
