import { RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';

import { AccountCreateComponent } from './account-create/account-create.component';
import { AccountMenuComponent } from './account-menu/account-menu.component';

const accountRoutes = [

  { path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'register',
    component: AccountCreateComponent,
    data: { appTitle: 'Magic Tauschbörse',
            pageTitle: 'Account Erstellen'
          }
  },
  {
    path: 'account-settings',
    component: AccountMenuComponent, canActivate: [AuthGuard],
    data: { appTitle: 'Magic Tauschbörse',
            pageTitle: 'Account Einstellungen'
          }
  },
];

export const accountRoutesModule = RouterModule.forChild(accountRoutes);
