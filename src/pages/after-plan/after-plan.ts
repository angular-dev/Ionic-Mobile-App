import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-after-plan',
  templateUrl: 'after-plan.html',
})
export class AfterPlan {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private toastCtrl: ToastController,
              public events: Events) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad After plan');
  }

}
