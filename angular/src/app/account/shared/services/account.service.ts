import { AnimationQueryMetadata, query } from '@angular/animations';
import { Injectable, Query } from '@angular/core';
import { Firestore, CollectionReference, doc, Timestamp } from '@angular/fire/firestore';
import { addDoc, collection, DocumentReference, DocumentSnapshot, getDoc, getDocs, onSnapshot, QueryDocumentSnapshot, QuerySnapshot, setDoc } from '@firebase/firestore';
import { Unsubscribe } from '@firebase/util';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.services';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  private _currentUser: any = null;
  private _subscriptions: Subscription[] = [];

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this._subscriptions.push(
      this._authService.loggedInState$.subscribe({
        next: (data) => {
          try {
            this._currentUser = JSON.parse(data.currentUser);
          } catch {}
        }
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

}
