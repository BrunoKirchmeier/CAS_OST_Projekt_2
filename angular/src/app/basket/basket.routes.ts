import { RouterModule } from '@angular/router';

import { BasketManageComponent } from './basket-manage/basket-manage.component';

const basketRoutes = [

  { path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'basket/',
    component: BasketManageComponent,
    data: { title: 'Warenkorb'}
  },
];

export const basketRoutesModule = RouterModule.forChild(basketRoutes);
