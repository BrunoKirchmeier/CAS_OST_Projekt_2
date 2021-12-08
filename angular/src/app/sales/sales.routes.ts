import { RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';

import { SalesSearchComponent } from '../sales/sales-search/sales-search.component';

const salesRoutes = [

  { path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'sales-search',
    component: SalesSearchComponent, canActivate: [AuthGuard],
    data: { title: 'Angebot suchen'}
  },
];

export const salesRoutesModule = RouterModule.forChild(salesRoutes);
