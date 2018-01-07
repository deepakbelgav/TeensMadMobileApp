import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, AlertController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmailValidator } from '../../providers/firebase/email';
import { AuthProvider } from '../../providers/firebase/auth';
import { HomePage } from '../home/home';
import {SignupPage} from '../signup/signup';
import {ResetPasswordPage} from '../reset-password/reset-password'
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: FormGroup;
  public loading: Loading;
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public authProvider: AuthProvider, public formBuilder: FormBuilder) {

    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required,
      EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6),
      Validators.required])]
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');   
  }

  loginUser(): void {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
      this.authProvider.loginUser(this.loginForm.value.email,this.loginForm.value.password)
        .then(authData => {
          this.loading.dismiss().then(() => {
            this.navCtrl.setRoot(HomePage);
          });
        }, error => {
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

  goToSignup(): void { this.navCtrl.push(SignupPage); }

  goToResetPassword(): void { this.navCtrl.push(ResetPasswordPage); }


}
