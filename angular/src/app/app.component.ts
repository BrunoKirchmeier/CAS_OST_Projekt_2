import { Component } from '@angular/core';
import { ApiScryfallService } from './api/api-scryfall.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular';

constructor(private scryfall: ApiScryfallService) {
  scryfall.getAllCardNames();
}


}
