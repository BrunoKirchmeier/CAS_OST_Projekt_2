
// System
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { navigationRoutesModule } from './navigation.routes';

// Custom Modules
import { NavigationComponent } from './navigation.component';

// Material Desing
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule} from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    NavigationComponent,
  ],
  imports: [
    CommonModule,
    // Router,
    navigationRoutesModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: []
})
export class NavigationModule {}
