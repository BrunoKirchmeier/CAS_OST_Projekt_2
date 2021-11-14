import { RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';

import { AccountCreateComponent } from './account-create/account-create.component';
import { AccountMenuComponent } from './account-menu/account-menu.component';

const accountRoutes = [

  { path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'register',
    component: AccountCreateComponent,
    data: { title: 'Account'}
  },
  {
    path: 'account-settings',
    component: AccountMenuComponent, canActivate: [AuthGuard],
    data: { title: 'Account Update'}
  },
];

export const accountRoutesModule = RouterModule.forChild(accountRoutes);
