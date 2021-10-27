import { Component } from '@angular/core';

import { Firestore, doc, DocumentReference, DocumentData, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth/';
import { from } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular';

  public isCollapsed = false;





  private doc: DocumentReference;

  constructor(private firestore: Firestore,
              private fireStoreAuth: Auth) {

                // this.fireStoreAuth.


    this.doc = doc(this.firestore, 'cards/hqWBVjCrPARptTQQWsgk');


    const docSnap =  getDoc(this.doc);
    console.log(docSnap);


  }

  ngOnInit(): void {
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


  ngOnDestroy() {}


}
