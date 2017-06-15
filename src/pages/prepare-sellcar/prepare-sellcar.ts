declare var BMap, BMAP_STATUS_SUCCESS;
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';

import { SharedService } from '../../providers/shared-service';

@IonicPage()
@Component({
  selector: 'page-parpare-sellcar',
  templateUrl: 'prepare-sellcar.html',
})
export class PrepareSellCar {

  carInfo: any;
  carDate: any;
  distance: any;
  currentLocation: any;
  userPhone: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private toastCtrl: ToastController,
              public events: Events,
              private sharedService: SharedService) {

      this.userPhone = navParams.get('phoneNumber');
      this.carInfo = {
        userPhone: this.userPhone,
        brandName: '',
        seriesName: '',
        currentLocation: '',
        distance: '',
        carDate: ''
      };
      console.log('user phone number', this.userPhone);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SellCar');

  	var geolocation = new BMap.Geolocation();
    var that = this;
  	geolocation.getCurrentPosition(function(r){
  		if(this.getStatus() == BMAP_STATUS_SUCCESS){
        console.log(r);
        that.currentLocation = r.address.city;
        that.carInfo.currentLocation = that.currentLocation;
        window.localStorage.setItem('sellCarInfo', JSON.stringify(that.carInfo));
  			var mk = new BMap.Marker(r.point);
  			console.log('您的位置：'+r.point.lng+','+r.point.lat);
  		}
  		else {
  			alert('failed'+this.getStatus());
  		}
  	},{enableHighAccuracy: true});
  }

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }

  setBrandSeries = (_params) => {
    return new Promise((resolve, reject) => {
        this.carInfo = _params;
        console.log("selected brand series : ", _params);
        resolve();
    });
  }

  openSelectBrand() {
    console.log("goto:SelectBrandPage");
    this.navCtrl.push('SelectBrand', {callback: this.setBrandSeries, whereIsItFrom: 'prepare-sellcar'})
  }

  updateCarDate(event) {
    console.log(this.carDate);
    this.carInfo.carDate = this.carDate;
    window.localStorage.setItem('sellCarInfo', JSON.stringify(this.carInfo));
  }

  updateDistance() {
    console.log(this.distance);
    this.carInfo.distance = this.distance;
    window.localStorage.setItem('sellCarInfo', JSON.stringify(this.carInfo));
  }

  updateLocation() {
    console.log(this.currentLocation);
    this.carInfo.currentLocation = this.currentLocation;
    window.localStorage.setItem('sellCarInfo', JSON.stringify(this.carInfo));
  }

  goAfterPlanPage() {
    if(this.carInfo.seriesName && this.carDate && this.distance && this.currentLocation) {
      var reqTime = this.sharedService.getCurrentDateYYYYMMDD();
      var reqParam = {
        userPhone: this.userPhone,
        sellcarBrand: this.carInfo.brandName,
        sellcarSeries: this.carInfo.seriesName,
        purchaseDate: this.carDate,
        totalDriven: this.distance,
        currentCarPlace: this.currentLocation,
        requestTime: reqTime,
        requestStatus: '没完'
      };

      this.sharedService.addSellcarRegisterToServer(reqParam).then( data => {
				if ( data['_body'] === 'OK') {
					this.sharedService.presentMiddleToast('请求登陆成功！');
          this.navCtrl.pop();
        } else {
					this.sharedService.presentMiddleToast('请求登陆失败！');
        }
      });
    }
  }

  goSellCarPage() {
    this.events.publish('goto:SellCarPage');
  }

}
