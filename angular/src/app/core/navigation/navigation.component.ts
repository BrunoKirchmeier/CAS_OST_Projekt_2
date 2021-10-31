import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

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

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(private breakpointObserver: BreakpointObserver) { }

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
  }

}
