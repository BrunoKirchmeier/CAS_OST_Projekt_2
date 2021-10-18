import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public title: string = "";

  constructor(private breakpointObserver: BreakpointObserver) { }

  public isMenuOpen = true;
  public contentMargin = 240;
  public isHandset: boolean = false;

  ngOnInit() {
    this.isMenuOpen = true;  // Open side menu by default
    this.title = 'Material Layout Demo';
    this.breakpointObserver.observe(Breakpoints.Handset)
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isHandset = true;
      } else {
        this.isHandset = false;
      }
    });
  }

  ngDoCheck() {
      if (this.isHandset) {
        this.isMenuOpen = false;
      } else {
        this.isMenuOpen = true;
      }
  }

}
