// System
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { basketRoutesModule } from './basket.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Custom Modules
import { SharedModule } from '../shared/shared.module'
import { BasketManageComponent } from './basket-manage/basket-manage.component';
import { BasketSummaryComponent } from './basket-summary/basket-summary.component';
import { BasketConfirmComponent } from './basket-confirm/basket-confirm.component';

// Material Desing
import { MatTabsModule } from '@angular/material/tabs';
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
    BasketManageComponent,
    BasketSummaryComponent,
    BasketConfirmComponent,
  ],
  imports: [
    CommonModule,
    basketRoutesModule,
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
    MatIconModule,
    MatExpansionModule,
    MatCheckboxModule,
  ],
  providers: [],
  bootstrap: []
})
export class BasketModule {}
