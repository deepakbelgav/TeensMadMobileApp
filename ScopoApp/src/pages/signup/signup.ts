import { Component } from '@angular/core';
import { IonicPage, NavController, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../providers/firebase/email';
import { AuthProvider } from '../../providers/firebase/auth';
import { HomePage } from '../home/home';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { SignupService } from './signup.service';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [SignupService]

})
export class SignupPage {

  public signupForm: FormGroup;
  loading: Loading;
  backgroundTags: any;
  backgroundTagsWithKey: object;
  specialisationTags: any;
  tempSpecialisationTags: any;
  selectedspecialisationTags: any[];
  selectedBackgroundTags: any[];

  constructor(private _sanitizer: DomSanitizer, public navCtrl: NavController, public authProvider: AuthProvider, public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private signupService: SignupService) {

    //form validator
    this.signupForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      backgroundTag: ['', Validators.compose([])],
      specialisationTag: ['', Validators.compose([])]
    });

    //get background tags
    this.signupService.getBackgroundTags(
      (data) => {
        this.backgroundTags = data.dataList;
        this.backgroundTagsWithKey = data.originalData;
        this.selectedBackgroundTags = [];
      },
      (errData) => {

      });

    this.signupService.getSpecialisationTags(
      (data) => {
        this.tempSpecialisationTags = data;
        this.specialisationTags = [];
        this.selectedspecialisationTags = [];
      },
      (errData) => {

      });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  getBackgroundTagFromInput(event) {
    if (this.backgroundTags.indexOf(event) != -1) {
      if (this.selectedBackgroundTags.indexOf(event) == -1) {
        this.selectedBackgroundTags.push(event);
        
        this.signupForm.controls.backgroundTag.reset();

        //delete it from the list so that does not come again when we search
        var index = this.backgroundTags.indexOf(event);
        if (index > -1) {
          this.backgroundTags.splice(index, 1);
        }

        Object.keys(this.backgroundTagsWithKey).forEach(key => {
          if (this.backgroundTagsWithKey[key] == event) {
            Object.keys(this.tempSpecialisationTags).forEach(_key => {
              if (this.tempSpecialisationTags[_key]['steamTagId'] == key) {
                console.log(" Found.");
                var data = this.tempSpecialisationTags[_key]['SpecialisationNames'];
                for (let key in data) {
                  if (data.hasOwnProperty(key)) {
                    this.specialisationTags.push(data[key]);
                  }
                }
                return;
              }
            });
          }
        });
      }
    }
  }

  getSpecialisationTagFromInput(event) {
    if (this.specialisationTags.indexOf(event) != -1) {
      if (this.selectedspecialisationTags.indexOf(event) == -1) {
        this.selectedspecialisationTags.push(event);
        this.signupForm.controls.specialisationTag.reset();
        //get specialisation/interest tags        
        var index = this.specialisationTags.indexOf(event);
        if (index > -1) {
          this.specialisationTags.splice(index, 1);
        }
      }
    }
  }

  deleteSpecialisationTag(tag) {
    var index = this.selectedspecialisationTags.indexOf(tag);
    if (index > -1) {
      this.selectedspecialisationTags.splice(index, 1);
      this.specialisationTags.push(tag);
    }
  }

  deleteBackgroundTag(tag) {
    var index = this.selectedBackgroundTags.indexOf(tag);
    if (index > -1) {
      this.selectedBackgroundTags.splice(index, 1);
      this.backgroundTags.push(tag);

      //delete all specialisation tags
      Object.keys(this.backgroundTagsWithKey).forEach(key => {
        if (this.backgroundTagsWithKey[key] == tag) {
          Object.keys(this.tempSpecialisationTags).forEach(_key => {
            if (this.tempSpecialisationTags[_key]['steamTagId'] == key) {
              console.log(" Found.");
              var data = this.tempSpecialisationTags[_key]['SpecialisationNames'];
              for (let key in data) {
                if (data.hasOwnProperty(key)) {
                  //this.specialisationTags.push(data[key]);
                  var index = this.selectedspecialisationTags.indexOf(data[key]);
                  if (index > -1) {
                    this.selectedspecialisationTags.splice(index, 1);
                  }
                  var _index = this.specialisationTags.indexOf(data[key]);
                  if (_index > -1) {
                    this.specialisationTags.splice(_index, 1);
                  }
                }
              }
              return;
            }
          });
        }
      });

    }
  }

  json(obj) {
    return JSON.stringify(obj);
  }

  signupUser() {
    if (!this.signupForm.valid) {
      console.log(this.signupForm.value);
    } else {
      this.loading = this.loadingCtrl.create();
      this.loading.present();

      var backgroundTags = this.signupService.identifyTheBackgroundTagIDs(this.selectedBackgroundTags,this.backgroundTagsWithKey);
      var specialisationTags=this.signupService.identifyTheSpecialisationTagIDs(backgroundTags,this.selectedspecialisationTags,this.tempSpecialisationTags)
      var userObj = {
                    email: this.signupForm.value.email,                     
                    dispalayName:this.signupForm.value.name,
                    backgroundNames:this.selectedBackgroundTags,
                    specialisationNames:this.selectedspecialisationTags,
                    backgroundTags:backgroundTags,
                    specialisationTags:specialisationTags
                }
                
      this.authProvider.signupUser(this.signupForm.value.email, this.signupForm.value.password,userObj)
        .then(() => {         
          this.loading.dismiss().then(() => {
            this.navCtrl.setRoot(HomePage);
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
}


