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
  selector: 'page-record',
  templateUrl: 'record.html'
})
export class Record {

  carList: any;
  recordList: any;
  
  constructor(public navCtrl: NavController,
              public events: Events, 
              public navParams: NavParams,
              public sharedService: SharedService) {
    this.recordList = this.sharedService.getRecordList();
    this.sharedService.getCarList().then(data => {
      console.log(data);
      this.carList = data;
      let carList = [];
      for(var i=0;i<this.recordList.length;i++) {
        for(var j=0;j<this.carList.length;j++) {
          if(this.recordList[i] == this.carList[j]._id) {
            carList.push(this.carList[j]);
            break;
          }
        }
      }
      this.carList = carList;
      console.log("cars from server : ", this.carList);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Record');
  }

}
