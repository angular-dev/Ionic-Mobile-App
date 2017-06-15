import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Platform } from 'ionic-angular';

import { SharedService } from '../../providers/shared-service';
import * as Constant from '../../providers/constants';
/**
 * Generated class for the Mine page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-mine',
  templateUrl: 'mine.html',
})
export class Mine {

	myphone: any;
  phone: any;
  code: any;
  favoriteCount: any;
  historyCount: any;
  recordCount: any;
  favoriteList: any;
  historyList: any;
  recordList: any;

  constructor(public navCtrl: NavController, 
              public events: Events,
              public http: Http,
              private toastCtrl: ToastController,
              public navParams: NavParams,
              public sharedService: SharedService,
              public platform: Platform) {
    this.phone = '';
  	this.myphone = '';
  	var phone = window.localStorage.getItem('myphone');
  	if(phone != null && phone != '') {
  		this.myphone = phone;
  	}

    this.favoriteList = this.sharedService.getFavoriteList();
    this.historyList = this.sharedService.getHistoryList();
    this.recordList = this.sharedService.getRecordList();
    this.favoriteCount = this.favoriteList.length;
    this.historyCount = this.historyList.length;
    this.recordCount = this.recordList.length;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Mine');
  }

  ionViewWillEnter() {
    this.favoriteList = this.sharedService.getFavoriteList();
    console.log("Favorites : ", this.favoriteList);
    this.historyList = this.sharedService.getHistoryList();
    this.recordList = this.sharedService.getRecordList();
    this.favoriteCount = this.favoriteList.length;
    this.historyCount = this.historyList.length;
    this.recordCount = this.recordList.length;
  }

  sendCode() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let url = Constant.API_ENDPOINT + '/auth/login';
    let obj = {
      num: this.phone
    };
    var response = {
      _body: ''
    }
    this.http.post(url, obj, options).subscribe(res => {
      let body = res.json();
      if(body.status == 'OK') {
        let toast = this.toastCtrl.create({
          message: '发送成功',
          duration: 1000,
          position: 'middle',
          cssClass: 'codeToast'
        });

        toast.present();
      } else {
        let toast = this.toastCtrl.create({
          message: '发送失败',
          duration: 1000,
          position: 'middle',
          cssClass: 'codeToast'
        });

        toast.present();
      }
    });
  }

  doLogin() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let url = Constant.API_ENDPOINT + '/auth/verify';

    let channelId = window.localStorage.getItem('channelId');
    let ostype = 'android';
    if(this.platform.is('ios') == true) {
      ostype = 'ios';
    }

    let obj = {
      num: this.phone,
      code : this.code,
      os: ostype,
      identifier: channelId
    };
    var that = this;
    this.http.post(url, obj, options).subscribe(res => {
      let body = res.json();
      console.log(body);
      console.log(this.phone);
      if(body.status == 'OK') {
        this.myphone = this.phone;
        window.localStorage.setItem('myphone', this.phone);
      } else {
        //this.myphone = this.phone;
        let toast = this.toastCtrl.create({
          message: '登录失败',
          duration: 1000,
          position: 'middle',
          cssClass: 'codeToast'
        });

        toast.present();
      }
    });
  }

  goBoughtCarPage() {
    this.events.publish('goto:BoughtCarPage');
  }

  goSoldCarPage() {
    this.events.publish('goto:SoldCarPage');
  }

  goSettingPage() {
    this.events.publish('goto:SettingPage');
  }

  goMyFavoritePage() {
    this.events.publish('goto:MyFavoritePage');
  }

  goHistoryPage() {
    this.events.publish('goto:HistoryPage');
  }

  goRecordPage() {
    this.events.publish('goto:RecordPage');
  }

  goBrowsePage() {
    this.events.publish('goto:BrowsePage');
  }
  
  callService() {
    this.events.publish('call:YouchiService');
  }
}
