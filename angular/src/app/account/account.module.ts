// System
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { accountRoutesModule } from './account.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Custom Components
import { AccountCreateComponent } from './account-create/account-create.component';
import { AccountMenuComponent } from './account-menu/account-menu.component';
import { AccountPersonalDataComponent } from './account-personal-data/account-personal-data.component';
import { IbanFormatterPipe } from './shared/pipes/iban-formatter.pipe'

// Material Desing
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule} from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AccountCreateComponent,
    AccountMenuComponent,
    AccountPersonalDataComponent,
    IbanFormatterPipe
  ],
  imports: [
    CommonModule,
    accountRoutesModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatSelectInfiniteScrollModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  providers: [IbanFormatterPipe],
  bootstrap: []
})
export class AccountModule {}
