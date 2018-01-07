import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { FirebaseConstants } from './firebaseConstants'

@Injectable()
export class AuthProvider {
    public fireAuth: any;
    public userData: any;
    constructor() {
        this.fireAuth = firebase.auth();
        this.userData = firebase.database().ref(FirebaseConstants.Users);
    }

    //login user
    loginUser(email: string, password: string): firebase.Promise<any> {

        return this.fireAuth.signInWithEmailAndPassword(email, password);
    }

    getLoggedInUser() {
        return this.fireAuth.currentUser;
    }

    //create new user
    signupUser(email: string, password: string,userObj:object): firebase.Promise<any> {
        return this.fireAuth.createUserWithEmailAndPassword(email, password)
            .then(newUser => {
                this.userData.child(newUser.uid).set(userObj);
            });
    }

    //reset the user password, link will be sent to created email id
    resetPassword(email: string): firebase.Promise<void> {
        return this.fireAuth.sendPasswordResetEmail(email);
    }

    //logout user
    logoutUser(): firebase.Promise<void> {
        return this.fireAuth.signOut();
    }
}