import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.services';

@Injectable()
export class AuthGuard implements CanActivate {

  private _isLoggedIn: boolean = false;
  private _subscriptions: Subscription[] = [];

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
