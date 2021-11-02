import { NgModule } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  /*
  constructor(private dbAuth: Auth) {
    this.dbAuth.onAuthStateChanged((user) => {
      if (user) {
        return
      } else {

      }
    });
  }
*/

}
