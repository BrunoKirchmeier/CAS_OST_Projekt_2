import { RouterModule } from '@angular/router';

import { AccountCreateComponent } from './account-create/account-create.component';

const accountRoutes = [

  { path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'register',
    component: AccountCreateComponent,
    data: { title: 'Account'}
  },

];

export const accountRoutesModule = RouterModule.forChild(accountRoutes);
