// System
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { salesRoutesModule } from './sales.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Custom Modules
import { SharedModule } from '../shared/shared.module'
import { SalesMenuComponent } from './sales-menu/sales-menu.component';
import { SalesSearchComponent } from './sales-search/sales-search.component';
import { DialogFilterComponent } from './sales-filter/sales-filter.component';
import { SalesFilterDialogService } from './shared/sales-filter-dialog.service'

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
    SalesMenuComponent,
    SalesSearchComponent,
    DialogFilterComponent,
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
    SalesFilterDialogService,
  ],
  bootstrap: []
})
export class SalesModule {}
