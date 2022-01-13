import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

import { HomeComponent } from './home/home.component';
import { AccountCreateComponent } from './account/account-create/account-create.component';
import { AccountMenuComponent } from './account/account-menu/account-menu.component';
import { LoginComponent } from './shared/components/login/login.component';
import { OfferMenuComponent } from './offer/offer-menu/offer-menu.component';
import { SaleCardSearchComponent } from './sale/sale-card-search/sale-card-search.component';
import { SaleOffersComponent } from './sale/sale-offers/sale-offers.component';
import { BasketManageComponent } from './basket/basket-manage/basket-manage.component';
import { BasketSummaryComponent } from './basket/basket-summary/basket-summary.component';


export const appRoutes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'home',
    component: HomeComponent,
    data: { appTitle: 'Magic Tauschbörse',
            pageTitle: 'Home'
          }
  },
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
  {
    path: 'login',
    component: LoginComponent,
    data: { appTitle: 'Magic Tauschbörse',
            pageTitle: 'Login'
          }
  },
  {
    path: 'offer',
    component: OfferMenuComponent, canActivate: [AuthGuard],
    data: { appTitle: 'Magic Tauschbörse',
            pageTitle: 'Meine Angebote'
          }
  },
  {
    path: 'sale-card-search',
    component: SaleCardSearchComponent,
    data: { appTitle: 'Magic Tauschbörse',
            pageTitle: 'Kartensuche'
          }
  },
  {
    path: 'sale-offers/:cardName',
    component: SaleOffersComponent,
    data: { appTitle: 'Magic Tauschbörse',
            pageTitle: 'Angebotsuche'
          }
  },
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
