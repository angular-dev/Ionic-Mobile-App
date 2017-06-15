import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { SharedService } from '../../providers/shared-service';
/**
 * Generated class for the Mine page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class History {
  carList: any;
  historyList: any;
  
  constructor(public navCtrl: NavController,
              public events: Events, 
              public navParams: NavParams,
              public sharedService: SharedService) {
    this.historyList = this.sharedService.getHistoryList();
    console.log("history : ", this.historyList);
    this.sharedService.getFavoritesWithIds({_id: this.historyList}).then(data => {
      this.carList = data['data'];
      console.log("cars from server : ", this.carList);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad History');
  }

  openCarDetailsPage(event, carInfo) {
  	this.events.publish('goto:CarDetailPage', carInfo);
  	// this.navCtrl.push('CarDetails');
  }

}
