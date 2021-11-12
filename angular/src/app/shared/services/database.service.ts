import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, DocumentReference, getDocs, QuerySnapshot, setDoc } from '@firebase/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { AuthService } from '../../shared/services/auth.services';

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  constructor(private _db: Firestore,
              private _authService: AuthService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  async createDoc<T>(data: T, tab: string): Promise<any> {
    try {
      const docRef: DocumentReference<DocumentData> = await addDoc(collection(this._db, tab), data);
      let updateData = {id: docRef.id};
      await setDoc(docRef, updateData, { merge: true });
    } catch (error) {
      return new Promise((reject) => {
        reject(error);
      });
    }
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  async readDoc<T>(query: any | null = null): Promise<any> {
    let data: T[] = [];
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
    return new Promise((resolve) => {
      resolve(data);
    });
  }

}
