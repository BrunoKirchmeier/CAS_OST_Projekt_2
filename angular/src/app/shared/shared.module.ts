// System
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Custom Modules
import { LoginComponent } from './components/login/login.component';
import { SearchCardByNameComponent } from './components/search-card/search-card-by-name/search-card-by-name.component';

// Material Desing
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { MatButtonModule} from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    LoginComponent,
    SearchCardByNameComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatSelectInfiniteScrollModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  exports: [
    SearchCardByNameComponent
  ],
  providers: [],
  bootstrap: []
})
export class SharedModule {}
