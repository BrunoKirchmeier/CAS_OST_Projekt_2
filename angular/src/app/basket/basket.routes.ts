import { RouterModule } from '@angular/router';
import { BasketManageComponent } from './basket-manage/basket-manage.component';
import { BasketSummaryComponent } from './basket-summary/basket-summary.component';

const basketRoutes = [

  { path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'basket',
    component: BasketManageComponent,
    data: { appTitle: 'Magic Tauschbörse',
            pageTitle: 'Warenkorb'
          }
  },
  {
    path: 'basket-summary',
    component: BasketSummaryComponent,
    data: { appTitle: 'Magic Tauschbörse',
            pageTitle: 'Kaufprozess'
          }
  },
];

export const basketRoutesModule = RouterModule.forChild(basketRoutes);
