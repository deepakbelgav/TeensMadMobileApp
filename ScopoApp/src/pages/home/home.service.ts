import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { FirebaseConstants } from '../../providers/firebase/firebaseConstants';
import { FirebaseProvider } from '../../providers/firebase/firebaseProvider';
import firebase from 'firebase';

@Injectable()
export class HomeService {

  constructor(private event: Events, private firebaseProvider: FirebaseProvider) { }

  getShoppingItems() {
    return this.firebaseProvider.getItems(FirebaseConstants.SpecialisationTags);
  }


  addItem(name) {
    //this.firebaseProvider.addItem(FirebaseConstants.SpecialisationTags, name);
    this.addSpecialisationTag(name);
  }


  public readPosts(onSuccess: (data) => void, onError: (data) => void = null): any {

    firebase.auth().onAuthStateChanged(function (userRef) {
      if (userRef) {
        //var wantedOrder = firebase.database().ref('orders').orderByChild('name').equalTo('yourText').on(listener you want.....)
        // var userRef = firebase.auth().currentUser;
        firebase.database().ref(FirebaseConstants.Users).child(userRef.uid).on("value", function (data) {
          var userData = data.val();
          var specialisiationTags = userData.specialisationTags;
          specialisiationTags.forEach(specialTagKey => {
            var ref = firebase.database().ref(FirebaseConstants.Posts).on("value", function (object) {
              var objects = object.val();
              for (var key in objects) {
                if (Object.prototype.hasOwnProperty.call(objects, key)) {                  
                  firebase.database().ref(FirebaseConstants.Posts).child(key).orderByChild(specialTagKey).equalTo(specialTagKey).on("value", function (snapshot) {
                    var newPost = snapshot.val();
                    if(newPost!=null){
                    //this.event.publish('wall-posts',newPost);
                      onSuccess(objects[key]);
                    }

                  });
                }
              }
            });
          });
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
      }
    });
  }


  writeNewPost(message: string) {
    var userRef = firebase.auth().currentUser;

    firebase.database().ref(FirebaseConstants.Users).child(userRef.uid).on("value", function (data) {
      var userData = data.val();
      var specialisationTagResult = {};
      for (var i = 0; i < userData.specialisationTags.length; i++) {
        specialisationTagResult[userData.specialisationTags[i]] = userData.specialisationTags[i];
      }

      var backgroundTagResult = {};
      for (var j = 0; j < userData.backgroundTags.length; j++) {
        backgroundTagResult[userData.backgroundTags[j]] = userData.backgroundTags[j];
      }
      // Get a key for a new Post.
      var newPostKey = firebase.database().ref().child('posts').push().key;
      var postData = {
        specialisationTag: specialisationTagResult,
        backgroundTags: backgroundTagResult,
        userId: userRef.uid,
        postData: message
      }
      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates[FirebaseConstants.Posts + newPostKey] = postData;
      updates[FirebaseConstants.UserPosts + userRef.uid + '/' + newPostKey] = postData;

      firebase.database().ref().update(updates);


      return true;

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }

  addSpecialisationTag(id) {
    this.firebaseProvider.addSpecialisationTag(FirebaseConstants.SpecialisationTags, id);


  }

  removeItem(id) {
    // this.afd.list(FirebaseConstants.SpecialisationTags).remove(id);
  }

}