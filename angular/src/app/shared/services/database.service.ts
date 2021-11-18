import { Injectable } from '@angular/core';
import { Firestore, collection, query, QuerySnapshot, DocumentReference, addDoc, getDoc, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';


@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  private _unsubscribe: [] = [];

  constructor (private _db: Firestore) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  async createDoc<T>(path: string,
                     data: T): Promise<any> {
    let success: boolean = true;
    let err: Error = {name: '', message: ''};
    const docRef: DocumentReference<DocumentData> = await addDoc(collection(this._db, path), data);
    let updateData = {_id: docRef.id,};
    await setDoc(docRef, updateData, { merge: true })
      .catch((error) => {
        success = false;
        err = error;
      })
    if(success) {
      return new Promise((resolve) => {
        resolve(true);
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
  }

  async readDoc<T>(query: any): Promise<any> {
    let success: boolean = true;
    let err: Error = {name: '', message: ''};
    let data: T[] = [];
    await getDocs<DocumentData>(query)
      .then((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach(doc => {
          let record = doc.data() as any;
          record._id = doc.id;
          record._ref = doc.ref;
          record = record as T;
          data.push(record);
        })
      })
      .catch((error) => {
        success = false;
        err = error;
      })
    if(success) {
      return new Promise((resolve) => {
        resolve(data);
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
  }

  async updateDoc<T>(query: any,
                     data: any): Promise<any> {
    let success: boolean = true;
    let err: Error = {name: '', message: ''};
    let docRef: any[] = [];
    // Get the reference of the searches records
    await this.readDoc(query)
      .then((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach(doc => {
          let temp = doc as any;
          docRef.push(temp._ref);
        })
      })
      .catch((error) => {
        success = false;
        err = error;
      })
      // Update all records
      for (var i=0; i<docRef.length; i++) {
        await updateDoc(docRef[i], data)
        .catch((error) => {
          success = false;
          err = error;
        })
      }
    if(success) {
      return new Promise((resolve) => {
        resolve(success);
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
  }

}




// https://firebase.google.cn/docs/firestore/query-data/listen?hl=en
