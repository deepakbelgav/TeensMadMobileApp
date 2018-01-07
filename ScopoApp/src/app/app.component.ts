import { HomePage } from '../pages/home/home';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs'
import { AdminPage } from '../pages/admin/admin'

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';

import { Firebase } from '@ionic-native/firebase';
import { Observable } from 'rxjs/Rx';
import { AlertController } from 'ionic-angular';

export class NotificationModel {
  public body: string;
  public title: string;
  public tap: boolean
}

@Component({
  templateUrl: 'app.html'
})



export class MyApp {
  rootPage: any = HomePage;

  constructor(private platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private firebase: Firebase, private alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.handlePushNotifications();

    });
  }

  handlePushNotifications() {
    if (this.platform.is('cordova')) {
      // Initialize push notification feature
      this.platform.is('android') ? this.initializeFireBaseAndroid() : this.initializeFireBaseIos();
    } else {
      console.log('Push notifications are not enabled since this is not a real device');
    }
  }

  private initializeFireBaseAndroid(): Promise<any> {
    return this.firebase.getToken()
      .catch(error => console.error('Error getting token', error))
      .then(token => {
        console.log(`The token is ${token}`);
        Promise.all([
          this.firebase.subscribe('firebase-app'),    // Subscribe to the entire app
          this.firebase.subscribe('android'),         // Subscribe to android users topic
          this.firebase.subscribe('userid-1')         // Subscribe using the user id (hardcoded in this example)
        ]).then((result) => {
          if (result[0]) console.log(`Subscribed to FirebaseDemo`);
          if (result[1]) console.log(`Subscribed to Android`);
          if (result[2]) console.log(`Subscribed as User`);
          this.subscribeToPushNotificationEvents();
        });
      });
  }

  private initializeFireBaseIos(): Promise<any> {
    return this.firebase.grantPermission()
      .catch(error => console.error('Error getting permission', error))
      .then(() => {
        this.firebase.getToken()
          .catch(error => console.error('Error getting token', error))
          .then(token => {

            console.log(`The token is ${token}`);

            Promise.all([
              this.firebase.subscribe('firebase-app'), // Subscribe to the entire app
              this.firebase.subscribe('ios'), // Subscribe to ios users topic
              this.firebase.subscribe('userid-2') // Subscribe using the user id (hardcoded in this example)

            ]).then((result) => {
              if (result[0]) console.log(`Subscribed to FirebaseDemo`);
              if (result[1]) console.log(`Subscribed to iOS`);
              if (result[2]) console.log(`Subscribed as User`);
              this.subscribeToPushNotificationEvents();
            });
          });
      })

  }

  private saveToken(token: any): Promise<any> {
    // Send the token to the server
    console.log('Sending token to the server...');
    return Promise.resolve(true);
  }

  private subscribeToPushNotificationEvents(): void {

    // Handle token refresh
    this.firebase.onTokenRefresh().subscribe(
      token => {
        console.log(`The new token is ${token}`);
        this.saveToken(token);
      },
      error => {
        console.error('Error refreshing token', error);
      });

    // Handle incoming notifications
    this.firebase.onNotificationOpen().subscribe(
      (notification: NotificationModel) => {

        !notification.tap
          ? console.log('The user was using the app when the notification arrived...')
          : console.log('The app was closed when the notification arrived...');

        let notificationAlert = this.alertCtrl.create({
          title: notification.title,
          message: notification.body,
          buttons: ['Ok']
        });
        notificationAlert.present();
      },
      error => {
        console.error('Error getting the notification', error);
      });
  }

}

