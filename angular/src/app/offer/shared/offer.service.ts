import { query } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Firestore, CollectionReference, doc, Timestamp } from '@angular/fire/firestore';
import { addDoc, collection, DocumentReference, DocumentSnapshot, getDoc, getDocs, onSnapshot, QueryDocumentSnapshot, QuerySnapshot, setDoc } from '@firebase/firestore';
import { Unsubscribe } from '@firebase/util';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../../shared/auth/auth.services';

@Injectable({
  providedIn: 'root'
})

export class OfferService {

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Declarations
  ////////////////////////////////////////////////////////////////////////////////////////////////

  private _currentUser: any = null;
  private _subscriptions: Subscription[] = [];
  private _unSubscriptions: Unsubscribe[] = [];

  public onChangeOffer$ = new BehaviorSubject<any>([]);

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
/*
    this._unSubscriptions.push(
      onSnapshot(collection(this._db, 'offers'),
      { includeMetadataChanges: true }, (snapshot: any) => {
        this.onChangeOffer$.next(snapshot);
      })
    );
*/
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
    this._unSubscriptions.forEach((element: Unsubscribe) => {
      element();
    });

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Database Statments
  ////////////////////////////////////////////////////////////////////////////////////////////////

  async createOffer(data: any): Promise<any> {
    const offer: IOffer = {offerId: null,
                           cardName: data.cardName,
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
    try {
      const docRef: DocumentReference<DocumentData> = await addDoc(collection(this._db, 'offers'), offer);
      offer.offerId = docRef.id;
      await setDoc(docRef, offer, { merge: true });
    } catch (error) {
      return new Promise((reject) => {
        reject(error);
      });
    }
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  async readOffers(id: string | null = null): Promise<any> {
    let data: IOffer[] = [];
    let test: any = [];
    try {
      if(id !== null) {
        const ret: DocumentSnapshot<DocumentData> = await getDoc(doc(this._db, "offers", id));
        if(ret.exists()) {
          let record = ret.data() as IOffer;
          record.offerId = ret.id;
          data.push(record);
        } else {
          throw('ID nicht gefunden');
        }
      } else {
        const ret: QuerySnapshot<DocumentData> = await getDocs(collection(this._db, 'offers'));
        ret.forEach(doc => {
          let record = doc.data() as IOffer;
          record.offerId = doc.id;
          data.push(record);
        });
      }
    } catch (error) {
      return new Promise((reject) => {
        reject(error);
      });
    }
    return new Promise((resolve) => {
      resolve(data);
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
export interface IOffer {
  offerId: string | null;
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
