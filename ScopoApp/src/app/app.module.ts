import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
 
import { MyApp } from './app.component';
import {LoginPage} from '../pages/login/login'
import {SignupPage} from '../pages/signup/signup'
import {ResetPasswordPage} from '../pages/reset-password/reset-password'
import{TabsPage} from'../pages/tabs/tabs'
import {AdminService} from '../pages/admin/admin.service'
import {AdminPage} from '../pages/admin/admin'
import {HomePage} from '../pages/home/home';
import {HomeService} from '../pages/home/home.service'
import {AnsweresSectionPage} from '../pages/answeres-section/answeres-section'
 
import { HttpModule } from '@angular/http';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { Firebase } from '@ionic-native/firebase';
import { AngularFireModule } from 'angularfire2';
import * as firebase from 'firebase';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';

import {KeysPipe} from '../pipes/keys/keys'

import { FirebaseProvider } from './../providers/firebase/firebaseProvider';
import { EmailValidator } from './../providers/firebase/email';
import { AuthProvider } from './../providers/firebase/auth';
 
const firebaseConfig = {
    apiKey: "AIzaSyBGi6tVUXGZzKlHLUDzeet6Lt533Q9sJaU",
    authDomain: "unified-atom-179304.firebaseapp.com",
    databaseURL: "https://unified-atom-179304.firebaseio.com",
    projectId: "unified-atom-179304",
    storageBucket: "unified-atom-179304.appspot.com",
    messagingSenderId: "673126761154"
  };
 firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    LoginPage,
    AdminPage,
    ResetPasswordPage,
    SignupPage,
    HomePage,
    AnsweresSectionPage,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFireDatabaseModule,
    Ng2AutoCompleteModule,
    AngularFireModule.initializeApp(firebaseConfig),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,   
    LoginPage,   
    HomePage,
    ResetPasswordPage,
    SignupPage,
    AnsweresSectionPage
    
  ],
  providers: [
    Firebase,
    StatusBar,
    SplashScreen,
    FirebaseProvider,
    AuthProvider,
    AdminService,
    HomeService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    //HomeService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}