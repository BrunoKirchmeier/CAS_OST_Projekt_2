import { Component } from '@angular/core';

import { Firestore } from '@angular/fire/firestore';
import { doc, DocumentReference, DocumentData, getDoc } from '@firebase/firestore';

import { from } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ApiScryfallService } from './api/api-scryfall.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular';

  public isCollapsed = false;

  private cardnames: [] = [];
  private subscribeCardNames: any;
  private doc: DocumentReference<DocumentData>;

  constructor(private scryfall: ApiScryfallService,
              private firestore: Firestore) {

    this.doc = doc(this.firestore, 'cards/hqWBVjCrPARptTQQWsgk');

    const docSnap =  getDoc(this.doc);
    console.log(docSnap);

  }

  ngOnInit(): void {

    this.subscribeCardNames = this.scryfall.getAllCardNames()
                              .subscribe({ next: data => this.cardnames,
                                           error: err => console.log(`ERR... ${err}`),
                                           complete: () => console.log(`Complete!`),
                                         });

    const test = this.getUserEventSummary()
                .subscribe({ next: data => console.log(data),
                            error: err => console.log(`ERR... ${err}`),
                            complete: () => console.log(`Complete!`),
                          });

  }


  getUserEventSummary() {
    return from(getDoc(doc(this.firestore, 'cards/hqWBVjCrPARptTQQWsgk'))).pipe(
      filter((docSnap: any) => docSnap.exists()),
      map(docSnap => docSnap.data())
    );
  }


  ngOnDestroy() {
    this.subscribeCardNames
    .unsubscribe();
  }


}


export interface cards { cardname: string; id: number; }
