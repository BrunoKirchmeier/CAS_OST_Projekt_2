import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.services';

@Injectable()
export class AuthGuard implements CanActivate {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Declarations
  ////////////////////////////////////////////////////////////////////////////////////////////////

  private _isLoggedIn: boolean = false;
  private _subscriptions: Subscription[] = [];


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(private _router: Router,
              private _authService: AuthService) {
    this._subscriptions.push(
      this._authService.loggedInState$.subscribe({
        next: data => this._isLoggedIn = data.loginState,
      })
    );

  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Event Functions
  ////////////////////////////////////////////////////////////////////////////////////////////////

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) {
    if(this._isLoggedIn) {
      return true;
    } else {
      this._router.navigate(['/login'], { queryParams: { redirectUrl: state.url }});
      return false;
    }

  }

}
