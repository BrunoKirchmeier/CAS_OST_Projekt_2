import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NoPreloading, RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';

import { environment } from 'src/environments/environment';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    RouterModule.forRoot(appRoutes, { useHash: false, preloadingStrategy: NoPreloading, enableTracing: !environment.production, relativeLinkResolution: 'legacy' }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
