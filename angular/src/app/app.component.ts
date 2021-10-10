import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiScryfallService } from './api/api-scryfall.service';
import { getApp } from '@angular/fire/app';
import { collection, doc, setDoc } from "firebase/firestore";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular';
  private cardnames: [] = [];
  private subscribeCardNames: any;

  constructor(private scryfall: ApiScryfallService) {}

  ngOnInit(): void {

    this.subscribeCardNames = this.scryfall.getAllCardNames()
                              .subscribe({ next: data => this.cardnames,
                                           error: err => console.log(`ERR... ${err}`),
                                           complete: () => console.log(`Complete!`),
                                         });
  }





  ngOnDestroy() {
    this.subscribeCardNames
    .unsubscribe();
  }


}


export interface cards { cardname: string; id: number; }
