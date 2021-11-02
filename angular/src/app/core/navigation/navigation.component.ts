import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../services/auth.services';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Declarations
  ////////////////////////////////////////////////////////////////////////////////////////////////

  @ViewChild('drawer', { static: true }) public matDrawer!: MatSidenav;

  public isMobile: boolean = false;
  public isMenuOpen: boolean = true;
  public contentMargin = 240;
  public isLoggedIn: Boolean = false;
  public redirectUrl: string = localStorage.getItem('redirectUrl') ?? '';

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(private breakpointObserver: BreakpointObserver,
              private _authService: AuthService,
              private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.isMenuOpen = true;

    this.breakpointObserver.observe(Breakpoints.Handset)
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });

    this._authService.isLoggedIn$
    .subscribe({ next: (status) => {
      this.isLoggedIn = localStorage.getItem('currentUser') === null
                      ? false
                      : true;
                }
              })

  }


  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Events
  ////////////////////////////////////////////////////////////////////////////////////////////////

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
    .then(() => {})
  }

}
