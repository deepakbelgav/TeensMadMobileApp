import { AdminService } from './admin.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';


/**
 * Generated class for the AdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {

  shoppingItems: FirebaseListObservable<any[]>;
  newItem = '';
 
  constructor(public navCtrl: NavController, private homeService: AdminService) {
    this.shoppingItems = this.homeService.getShoppingItems();
  }
 
  addItem() {
    this.homeService.addItem(this.newItem);
  }
 
  removeItem(id) {
    this.homeService.removeItem(id);
  }
  

}
