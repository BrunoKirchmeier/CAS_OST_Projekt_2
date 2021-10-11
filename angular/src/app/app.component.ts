import { Component } from '@angular/core';
import { Firestore, FirestoreInstances, FirestoreModule } from '@angular/fire/firestore';
import { doc, onSnapshot } from '@firebase/firestore';
import { DocumentData, DocumentReference } from 'rxfire/firestore/interfaces';
import { Observable } from 'rxjs';
import { ApiScryfallService } from './api/api-scryfall.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular';

  private cardnames: [] = [];
  private subscribeCardNames: any;
  private doc: DocumentReference<DocumentData>;

  constructor(private scryfall: ApiScryfallService,
              private firestore: Firestore) {

     this.doc = doc<DocumentData>(this.firestore, 'foo/bar')
  }

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
