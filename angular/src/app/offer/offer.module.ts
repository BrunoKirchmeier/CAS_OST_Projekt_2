// System
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { offerRoutesModule } from './offer.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Custom Modules
import { SharedModule } from '../shared/shared.module'
import { OfferMenuComponent } from './offer-menu/offer-menu.component';
import { OfferCreateComponent } from '../offer/offer-create/offer-create.component';
import { OfferUpdateComponent } from './offer-update/offer-update.component';

// Material Desing
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    OfferMenuComponent,
    OfferCreateComponent,
    OfferUpdateComponent,
  ],
  imports: [
    CommonModule,
    offerRoutesModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatSelectInfiniteScrollModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: []
})
export class OfferModule {}
