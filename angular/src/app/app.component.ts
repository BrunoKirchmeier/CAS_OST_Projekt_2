import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'angular';

  public isCollapsed = false;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy() {
    localStorage.removeItem('currentUser');
  }

}
