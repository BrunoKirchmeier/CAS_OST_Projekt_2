// System
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { offerRoutesModule } from './sales.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Custom Modules
import { SharedModule } from '../shared/shared.module'
import { SalesMenuComponent } from './sales-menu/sales-menu.component';
import { SalesSearchComponent } from './sales-search/sales-search.component';

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
    SalesMenuComponent,
    SalesSearchComponent,
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
export class SalesModule {}
