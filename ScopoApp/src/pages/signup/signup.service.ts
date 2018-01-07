import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseConstants } from '../../providers/firebase/firebaseConstants';
import { FirebaseProvider } from '../../providers/firebase/firebaseProvider';
import firebase from 'firebase';

@Injectable()
export class SignupService {

  constructor(public afd: AngularFireDatabase, private firebaseProvider: FirebaseProvider) { }


  public getBackgroundTags(onSuccess: (data) => void, onError: (data) => void = null): any {
    this.afd.object(FirebaseConstants.Streams, { preserveSnapshot: true }).subscribe(data => {
      var listOfbackgroundtags = [];
      var data = data.val();
      Object.keys(data).forEach(function (key) {
        listOfbackgroundtags.push(data[key]);
      });
      var newData = {
        dataList: listOfbackgroundtags,
        originalData: data
      }
      onSuccess(newData);
    }, error => {
      onError(error);
    });
  }


  public getSpecialisationTags(onSuccess: (data) => void, onError: (data) => void = null): any {
    this.afd.object(FirebaseConstants.SpecialisationTags, { preserveSnapshot: true }).subscribe(data => {
      onSuccess(data.val());
    }, error => {
      onError(error);
    });
  }

  addBackgroundTag(name) {
    this.firebaseProvider.addItem(FirebaseConstants.Streams, name);
  }

  removeBackgroundTag(id) {
    this.afd.list(FirebaseConstants.Streams).remove(id);
  }

  identifyTheBackgroundTagIDs(keys: any[], backgroundTagsWithKey: any) {
    var keyIdsList = [];
    keys.forEach(element => {
      Object.keys(backgroundTagsWithKey).forEach(key => {
        if (backgroundTagsWithKey[key] == element) {
          keyIdsList.push(key);
        }
      });
    });
    return keyIdsList;
  }

  identifyTheSpecialisationTagIDs(backgroundKeys: any[], specialisationkeys: any[], tempSpecialisationTags: any) {
    var keyIdsList = [];
    backgroundKeys.forEach(key => {
      Object.keys(tempSpecialisationTags).forEach(_key => {
        if (tempSpecialisationTags[_key]['steamTagId'] == key) {
          console.log(" Found.");
          var data = tempSpecialisationTags[_key]['SpecialisationNames'];
          for (let key_ in data) {
            if (data.hasOwnProperty(key_)) {
              //this.specialisationTags.push(data[key]);
              var _keyValue = data[key_];
              specialisationkeys.forEach(element => {
                if (_keyValue == element) {
                  keyIdsList.push(key_);
                }
              });
            }
          }
        }
      });
    });

    return keyIdsList;

  }

}