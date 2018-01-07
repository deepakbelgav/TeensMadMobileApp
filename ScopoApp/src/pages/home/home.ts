import { PipesModule } from '../../pipes/pipes.module';
import { Component } from '@angular/core';
import { IonicPage, NavController, Loading, LoadingController, AlertController,Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/firebase/auth';
import { LoginPage } from '../login/login'
import firebase from 'firebase';
import { HomeService } from './home.service';
import { FirebaseListObservable } from 'angularfire2/database';
import {AnsweresSectionPage} from '../answeres-section/answeres-section'
//import {KeysPipe} from '../../pipes/keys/keys'

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loading: Loading;
  wallPosts: any[];
  newItem = '';

  constructor(public navCtrl: NavController, public authProvider: AuthProvider, public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private homeService: HomeService,private event :Events) {
    firebase.auth().onAuthStateChanged(function (user) {
      if (!user) {
        navCtrl.setRoot(LoginPage);
      }else{
        
      }
    });
    this.wallPosts = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');    
    this.homeService.readPosts(
      (data) => {
        if(data!=null)
          this.wallPosts.push(data);
        
      },
      (errData) => {

      });
  }

  addItem() {
   // this.homeService.addItem(this.newItem);
   this.homeService.writeNewPost(this.newItem);
    this.newItem = '';   
  }

  removeItem(id) {
    this.homeService.removeItem(id);
  }

  navigateToAnsweresPage(selectedObject){
    this.navCtrl.push(AnsweresSectionPage);
  }

  logout() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.authProvider.logoutUser().then(() => {
      this.loading.dismiss().then(() => {
        this.navCtrl.setRoot(LoginPage);
      });
    }, (error) => {
      this.loading.dismiss().then(() => {
        let alert = this.alertCtrl.create({
          message: error.message,
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        alert.present();
      });
    });
  }

}
