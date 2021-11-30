import { Injectable } from '@angular/core';
import { Firestore, collection, QuerySnapshot, DocumentReference, addDoc, getDocs, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';


@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  constructor (private _db: Firestore) {}

  async createDoc<T>(path: string,
                     data: T): Promise<any> {
    const docRef: DocumentReference<DocumentData> = await addDoc(collection(this._db, path), data);
    let updateData = {_id: docRef.id,};
    await setDoc(docRef, updateData, { merge: true })
    return new Promise((resolve) => {
      resolve(docRef.id);
    });
  }

  async readDoc<T>(query: any): Promise<any> {
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
    return new Promise((resolve) => {
      resolve(data);
    });
  }

  async updateDoc<T>(query: any,
                     data: any): Promise<any> {
    let docRef: any[] = [];
    // Get the reference of the searches records
    await this.readDoc(query)
      .then((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach(doc => {
          let temp = doc as any;
          docRef.push(temp._ref);
        })
      })
    // Update all records
    for (var i=0; i<docRef.length; i++) {
      await updateDoc(docRef[i], data)
    }
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  async deleteDoc<T>(query: any): Promise<any> {
    let docRef: any[] = [];
    // Get the reference of the searches records
    await this.readDoc(query)
      .then((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach(doc => {
          let temp = doc as any;
          docRef.push(temp._ref);
        })
      })
    // Update all records
    for (var i=0; i<docRef.length; i++) {
      await deleteDoc(docRef[i])
    }
    return new Promise((resolve) => {
      resolve(true);
    });
  }

}




// https://firebase.google.cn/docs/firestore/query-data/listen?hl=en
