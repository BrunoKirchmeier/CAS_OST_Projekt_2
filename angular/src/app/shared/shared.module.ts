// System
import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Custom Modules
import { DialogInfoComponent } from './components/dialog/dialog-info.component';
import { LoginComponent } from './components/login/login.component';
import { SearchCardByNameComponent } from './components/search-card/search-card-by-name/search-card-by-name.component';

// Providers
import { DialogService } from './services/dialog.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { ErrorLoggerService } from './services/error-logger.service';

// Material Desing
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { MatButtonModule} from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [
    DialogInfoComponent,
    LoginComponent,
    SearchCardByNameComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatDialogModule,
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
    InfiniteScrollModule,
  ],
  exports: [
    SearchCardByNameComponent,
  ],
  providers: [ErrorLoggerService, { provide: ErrorHandler, useClass: ErrorHandlerService }, DialogService],
  bootstrap: []
})
export class SharedModule {}
