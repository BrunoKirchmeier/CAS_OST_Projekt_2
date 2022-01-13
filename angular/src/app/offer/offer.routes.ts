import { RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';

import { OfferCreateComponent } from '../offer/offer-create/offer-create.component';
import { OfferUpdateComponent } from './offer-update/offer-update.component';

const offerRoutes = [

  { path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'offer-create',
    component: OfferCreateComponent, canActivate: [AuthGuard],
    data: { appTitle: 'Magic Tauschbörse',
            pageTitle: 'Angebot erstellen'
          }
  },
  {
    path: 'offer-update',
    component: OfferUpdateComponent,
    data: { appTitle: 'Magic Tauschbörse',
            pageTitle: 'Angebot suchen'
          }
  },
];

export const offerRoutesModule = RouterModule.forChild(offerRoutes);
