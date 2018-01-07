import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseConstants } from '../../providers/firebase/firebaseConstants';
import { FirebaseProvider } from '../../providers/firebase/firebaseProvider';

@Injectable()
export class AdminService {

  constructor(public afd: AngularFireDatabase, private firebaseProvider:FirebaseProvider) { }

  getShoppingItems() {
    return this.firebaseProvider.getItems(FirebaseConstants.Streams);
  }

  addItem(name) {
    this.firebaseProvider.addItem(FirebaseConstants.Streams,name);    
  }

  removeItem(id) {
    this.afd.list(FirebaseConstants.Streams).remove(id);
  }
  
}