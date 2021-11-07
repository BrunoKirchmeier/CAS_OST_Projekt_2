// System
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { accountRoutesModule } from './account.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Custom Modules
import { AccountCreateComponent } from './account-create/account-create.component';

// Material Desing
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AccountCreateComponent
  ],
  imports: [
    CommonModule,
    accountRoutesModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatSelectInfiniteScrollModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: []
})
export class AccountModule {}
