// Configurations
import { environment } from 'src/environments/environment';

// System Modules
import { NgModule } from '@angular/core';
import { NoPreloading, RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { enableIndexedDbPersistence, getFirestore, provideFirestore, FirestoreModule } from '@angular/fire/firestore';
import { AuthModule } from '@angular/fire/auth/';

// Custom Modules
import { SharedModule } from './shared/shared.module';
import { AccountModule } from './account/account.module';
import { OfferModule } from './offer/offer.module';
import { SalesModule } from './sales/sales.module';

// Custom Components
import { NavigationComponent } from './shared/components/navigation/navigation.component';

// Providers
import { AuthGuard } from './shared/guards/auth.guard';

// Material Desing vor Navigation Module
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule} from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: false, preloadingStrategy: NoPreloading, enableTracing: !environment.production, relativeLinkResolution: 'legacy' }),
    BrowserAnimationsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const firestore = getFirestore();
      enableIndexedDbPersistence(firestore);
      return firestore;
    }),
    FirestoreModule,
    AuthModule,
    SharedModule,
    AccountModule,
    OfferModule,
    SalesModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
  ],
  exports: [
    RouterModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
