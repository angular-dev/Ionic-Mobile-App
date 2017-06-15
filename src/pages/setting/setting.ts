import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

/**
 * Generated class for the Mine page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class Setting {

  constructor(public navCtrl: NavController,
              public events: Events, 
    					public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SoldCar');
  }

  logOut() {
  	window.localStorage.setItem('myphone', '');
  	this.events.publish('goto:MinePage');
  }
}
