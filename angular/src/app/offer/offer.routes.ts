import { RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';

import { OfferCreateComponent } from './offer-create/offer-create.component';
import { OfferSearchComponent } from './offer-search/offer-search.component';

const offerRoutes = [

  { path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'offer-create',
    component: OfferCreateComponent, canActivate: [AuthGuard],
    data: { title: 'Angebot erstellen'}
  },
  {
    path: 'offer-search',
    component: OfferSearchComponent,
    data: { title: 'Angebotssuche'}
  },
];

export const offerRoutesModule = RouterModule.forChild(offerRoutes);
