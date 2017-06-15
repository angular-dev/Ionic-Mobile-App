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
  selector: 'page-browse',
  templateUrl: 'browse.html'
})
export class Browse {

  carInfos: Array<{
    carIndex: Number,
    carName: string, 
    carThumbUrl: string,
    carPriceWithoutTax: string, 
    carPriceWithTax: string,
    carPosition: string,
    carProductDate: string,
    carTotalTraveling: string,
    carGearshiftType: string
  }>;
  
  constructor(public navCtrl: NavController,
              public events: Events, 
    					public navParams: NavParams) {
    this.carInfos = [];
    // for(let i = 1; i < 11; i++) {
    //   this.carInfos.push({
    //     carIndex: i,
    //     carName: "飞渡016款1.5L EXLI CVT 领先版",
    //     carThumbUrl: "assets/images/car-thumb.png",
    //     carPriceWithoutTax: "3.88万",
    //     carPriceWithTax: "新车指导价（含税）12.28万",
    //     carPosition: "合肥",
    //     carProductDate: "2014.9",
    //     carTotalTraveling: "1.5公里",
    //     carGearshiftType: "自动"
    //   });
    // }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Browse');
  }

}
