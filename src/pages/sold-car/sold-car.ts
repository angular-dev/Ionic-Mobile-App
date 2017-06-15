import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Mine page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sold-car',
  templateUrl: 'sold-car.html',
})
export class SoldCar {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SoldCar');
  }

}
