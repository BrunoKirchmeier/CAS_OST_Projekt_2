import { Component, OnDestroy, OnInit, DoCheck, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../../services/auth.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Router, RoutesRecognized } from '@angular/router';

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
  public siteTitle: String = '';

  constructor(private _breakpointObserver: BreakpointObserver,
              private _authService: AuthService,
              private _snackBar: MatSnackBar,
              private _router: Router) {}

  ngOnInit() {
    this.isMenuOpen = true;
    this._subscriptions.push(
      this._router.events.subscribe(event => {
        if (event instanceof RoutesRecognized) {
          let route = event.state.root.firstChild;
          this.siteTitle = route?.data.appTitle || '';
        }
      })
    )
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
