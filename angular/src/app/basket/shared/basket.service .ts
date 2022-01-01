import { Injectable } from '@angular/core';
import { Firestore, query, collection, where, QuerySnapshot, Timestamp,  } from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { AuthService } from 'src/app/shared/services/auth.services';
import { DatabaseService } from 'src/app/shared/services/database.service';

@Injectable({
  providedIn: 'root'
})

export class BasketService {



  constructor(private _authService: AuthService,
              private _dbExt: DatabaseService,
              private _db: Firestore) {
  }




}

export interface IBasketData {
  _id: string;
  offerId: string;
  buyerUid: string;

}


