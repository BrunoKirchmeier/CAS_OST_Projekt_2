import { AnimationQueryMetadata, query } from '@angular/animations';
import { Injectable, OnDestroy, Query } from '@angular/core';
import { Firestore, CollectionReference, doc, Timestamp } from '@angular/fire/firestore';
import { addDoc, collection, DocumentReference, DocumentSnapshot, getDoc, getDocs, onSnapshot, QueryDocumentSnapshot, QuerySnapshot, setDoc } from '@firebase/firestore';
import { Unsubscribe } from '@firebase/util';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.services';

@Injectable({
  providedIn: 'root'
})

export class OfferService implements OnDestroy {

  private _currentUser: any = null;
  private _subscriptions: Subscription[] = [];
  private _unSubscriptions: Unsubscribe[] = [];

  constructor(private _db: Firestore,                 /////////////   _dbExt: DatabaseService ////////////////////////////////////////////////////////////////
              private _authService: AuthService) {}

  ngOnInit(): void {
    this._subscriptions.push(
      this._authService.onChangeloggedInState$.subscribe({
        next: (data) => { this._currentUser = JSON.parse(data.currentUser);},
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
    this._unSubscriptions.forEach((element: Unsubscribe) => {
      element();
    });

  }

  async createOffer(data: any): Promise<any> {
    /*
    const offer: IOffer = {id: null,
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
      offer.id = docRef.id;
      await setDoc(docRef, offer, { merge: true });
    } catch (error) {
      return new Promise((reject) => {
        reject(error);
      });
    }
    */
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  async readDoc<T>(query: any | null = null): Promise<any> {

    let data: T[] = [];
    /*
    try {
      if(query !== null) {
        const ret: QuerySnapshot<DocumentData> = await getDocs(query);
        if(ret.empty) {
          throw('Query Abfrage ist leer');
        } else {
          ret.forEach(doc => {
            let record = doc.data() as any;
            record.id = doc.id;
            record = record as T;
            data.push(record);
          });
        }
      } else {
        const ret: QuerySnapshot<DocumentData> = await getDocs(collection(this._db, 'offers'));
        ret.forEach(doc => {
          let record = doc.data() as any;
          record.id = doc.id;
          data.push(record);
        });
      }
    } catch (error: any) {
      return new Promise((reject) => {
        reject(error);
      });
    }
    */
    return new Promise((resolve) => {
      resolve(data);
    });
  }

}
export interface IOffer {
  id: string | null;
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
