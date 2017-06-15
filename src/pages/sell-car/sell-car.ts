import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { SharedService } from '../../providers/shared-service';

@IonicPage()
@Component({
  selector: 'page-sell-car',
  templateUrl: 'sell-car.html',
})
export class SellCar {

  faqList: any;

  phone = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              private toastCtrl: ToastController,
              public sharedService: SharedService) {

    this.sharedService.getFaqList().then(data => {
      this.faqList = data;
      console.log("faqs from server : ", this.faqList);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SellCar');
  }

  itemSelected(item: any) {
    if(item.show === true) {
      item.show = false;
    } else {
      item.show = true;
    }
    console.log("Selected Item", item);
  }

  callService() {
    this.events.publish('call:YouchiService');
  }

  goPrepareSellCar() {
    console.log(this.phone);
    if(this.phone == '') {
      this.sharedService.presentMiddleToast('请输入手机号');
      return ;
    }
    if(this.phone.length < 11) {
      this.sharedService.presentMiddleToast('手机号格式错误');
      return ;
    }

    this.navCtrl.push('PrepareSellCar', {phoneNumber: this.phone});
  }
}
