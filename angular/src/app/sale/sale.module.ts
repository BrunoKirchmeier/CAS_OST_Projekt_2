// System
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { salesRoutesModule } from './sale.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from '../shared/Intercept/http-interceptor.service';

// Custom Modules
import { SharedModule } from '../shared/shared.module'
import { SaleCardSearchComponent } from './sale-card-search/sale-card-search.component';
import { DialogFilterComponent } from './sale-filter/sale-filter.component';
import { SaleFilterDialogService } from './shared/sale-filter-dialog.service'
import { SaleOffersComponent } from './sale-offers/sale-offers.component'

// Material Desing
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    SaleCardSearchComponent,
    DialogFilterComponent,
    SaleOffersComponent,
  ],
  imports: [
    CommonModule,
    salesRoutesModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatSelectInfiniteScrollModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatCheckboxModule,
  ],
  providers: [
    MatDialog,
    { provide: MatDialogRef,
      useValue: {}
    },
    SaleFilterDialogService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
  ],
  bootstrap: []
})
export class SalesModule {}
