import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { FirebaseConstants } from './firebaseConstants'

@Injectable()
export class FirebaseProvider {


  constructor(public afd: AngularFireDatabase) { }

  getItems(fbObject: string) {
    return this.afd.list(fbObject);
  }

  addItem(fbObject: string, key: string) {
    return this.afd.list(fbObject).push(key).then((uniqueKey) => {
      console.log(uniqueKey);
    })
  }

  addSpecialisationTag(fbObject: string, key: string) {

    this.afd.list(FirebaseConstants.SpecialisationTags).push({
      steamTagId: key      
    }).then((uniqueKey) => {
      console.log(uniqueKey);
      var ref = firebase.database().ref(FirebaseConstants.SpecialisationTags);
      ref.child(uniqueKey.key).child(FirebaseConstants.SpecialisationNames).push('spec-a');
      ref.child(uniqueKey.key).child(FirebaseConstants.SpecialisationNames).push('spec-b');
      ref.child(uniqueKey.key).child(FirebaseConstants.SpecialisationNames).push('spec-c');
      ref.child(uniqueKey.key).child(FirebaseConstants.SpecialisationNames).push('spec-d');
      ref.child(uniqueKey.key).child(FirebaseConstants.SpecialisationNames).push('spec-c');
      ref.child(uniqueKey.key).child(FirebaseConstants.SpecialisationNames).push('spec-e');
    })



  }

  updateItem(fbObject: string, key: string, id: any) {
    this.afd.list(fbObject).update(id, {
      //update the object here
    });
  }

  removeItem(fbObject: string, id) {
    this.afd.list(fbObject).remove(id);
  }
}