// System
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
import { authRoutesModule } from './auth.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Custom Modules
import { LoginComponent } from './login/login.component';

// Material Desing
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule} from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    authRoutesModule,
    // Router,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: []
})
export class AuthentificationModule {}
