import { query } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Firestore, CollectionReference, doc, Timestamp } from '@angular/fire/firestore';
import { collection, onSnapshot, setDoc } from '@firebase/firestore';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.services';

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Declarations
  ////////////////////////////////////////////////////////////////////////////////////////////////

  private _currentUser: any = null;
  private _subscriptions: Subscription[] = []

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Constructor and destructor
  ////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(private _db: Firestore,
              private _authService: AuthService) {
    this._subscriptions.push(
      this._authService.loggedInState$.subscribe({
        next: data => this._currentUser = JSON.parse(data.currentUser),
      })
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Database Statments
  ////////////////////////////////////////////////////////////////////////////////////////////////

  /*
  writeOffer(data: IOffers): Promise<any> {
    setDoc(doc(this._db, "offers", this._currentUser.uid), data)
    .then(docRef => {
      console.log("Document written with ID: ", docRef.id);
      console.log("You can now also access this. as expected: ", this.foo)
  })
  .catch(error => console.error("Error adding document: ", error))

    return new Promise((resolve, reject) => {
      resolve(1);
    });
  }
*/

  async writeOffer(data: any): Promise<any> {
    const offer: IOffers = {cardName: data.cardName,
                            providerUid: this._currentUser.uid,
                            providerEmail: this._currentUser.email,
                            buyerUid: null,
                            buyerEmail: null,
                            unitPrice: data.unitPrice,
                            quantity: data.quantity,
                            deliveryMode: data.deliveryMode,
                            additionInfo: data.additionInfo,
                            creationDate : Timestamp.now(),
                            saleDate : null};

    const ret = await setDoc(doc(this._db, "offers", this._currentUser.uid), offer);
    return new Promise((resolve, reject) => {
      resolve(ret);
      // reject(ret);
    });
  }





/*
    const unsubscribe = onSnapshot(
      collection(this._db, "cities"),
      (snapshot) => {
        // ...
      },
      (error) => {
        // ...
      });
      */



}

////////////////////////////////////////////////////////////////////////////////////////////////
// Interfaces
////////////////////////////////////////////////////////////////////////////////////////////////

/*
  Datatyp: API Scryfall Response of List Objects
*/
export interface IOffers {
  // offerId: number;
  cardName: string;
  providerUid: string;
  providerEmail: string ;
  buyerUid: string | null;
  buyerEmail: string | null;
  unitPrice: number;
  quantity: number;
  deliveryMode: number;
  additionInfo: string | null;
  creationDate : Timestamp;
  saleDate : Timestamp | null;
}
