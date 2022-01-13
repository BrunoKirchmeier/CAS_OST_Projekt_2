import { RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { BasketManageComponent } from './basket-manage/basket-manage.component';
import { BasketSummaryComponent } from './basket-summary/basket-summary.component';

const basketRoutes = [

  { path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'basket',
    component: BasketManageComponent, canActivate: [AuthGuard],
    data: { appTitle: 'Magic Tauschbörse',
            pageTitle: 'Warenkorb'
          }
  },
  {
    path: 'basket-summary',
    component: BasketSummaryComponent, canActivate: [AuthGuard],
    data: { appTitle: 'Magic Tauschbörse',
            pageTitle: 'Kaufprozess'
          }
  },
];

export const basketRoutesModule = RouterModule.forChild(basketRoutes);
