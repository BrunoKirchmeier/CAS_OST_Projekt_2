// System
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Custom Modules
import { SearchCardByNameComponent } from './search-card-by-name/search-card-by-name.component';

// Material Desing
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    SearchCardByNameComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatSelectInfiniteScrollModule,
    MatInputModule,
    MatButtonModule,
  ],
  exports:   [SearchCardByNameComponent],
  providers: [],
  bootstrap: []
})
export class SearchCardModule {}
