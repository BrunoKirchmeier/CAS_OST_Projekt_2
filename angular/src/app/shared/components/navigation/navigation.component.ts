import { Component, OnDestroy, OnInit, DoCheck, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../../services/auth.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy, DoCheck {

  @ViewChild('drawer', { static: true }) public matDrawer!: MatSidenav;

  private _subscriptions: Subscription[] = [];

  public isMobile: boolean = false;
  public isMenuOpen: boolean = true;
  public contentMargin = 240;
  public isLoggedIn: Boolean = false;

  constructor(private _breakpointObserver: BreakpointObserver,
              private _authService: AuthService,
              private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.isMenuOpen = true;
    this._subscriptions.push(
      this._breakpointObserver.observe(Breakpoints.Handset)
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }
      })
    );
    this._subscriptions.push(
      this._authService.onChangeloggedInState$.subscribe({
        next: data => this.isLoggedIn = data.loginState,
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  ngDoCheck() {
      if (this.isMobile) {
        this.isMenuOpen = false;
      } else {
        this.isMenuOpen = true;
      }
  }

  closeMenue() {
    if(this.isMobile === true) {
      this.isMenuOpen = false;
      this.matDrawer.close();
    }
    this._snackBar.dismiss();
  }

  logout() {
    this._authService.logout()
    .then(() => { window.location.reload();})
  }

}
