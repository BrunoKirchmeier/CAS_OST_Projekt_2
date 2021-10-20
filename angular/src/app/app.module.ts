import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { environment } from 'src/environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { enableIndexedDbPersistence, getFirestore, provideFirestore } from '@angular/fire/firestore';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatIconModule} from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule} from '@angular/material/button';

import { NoPreloading, RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { CardSearchComponent } from './card-search/card-search.component';


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    CardSearchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const firestore = getFirestore();
      enableIndexedDbPersistence(firestore);
      return firestore;
    }),
    NgbModule,
    RouterModule.forRoot(appRoutes, { useHash: false, preloadingStrategy: NoPreloading, enableTracing: !environment.production, relativeLinkResolution: 'legacy' }),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatListModule,
    MatSnackBarModule,
    ScrollingModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
