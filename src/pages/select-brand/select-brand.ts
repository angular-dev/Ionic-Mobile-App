import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { SharedService } from '../../providers/shared-service';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';

import * as Constant from '../../providers/constants';
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'page-select-brand',
  templateUrl: 'select-brand.html',
})
export class SelectBrand {

  mainCars: any;
  subCars: any;
  alphaList: any;
  currentCar: any;
  currentSeries: any;
  carList: any;
  endpointUrl: string = Constant.API_ENDPOINT;

  callback: any;
  trigeerPage: any;
  allowNoSelectionFlag: boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private toastCtrl: ToastController,
              public events: Events,
              public sharedService: SharedService,
              public http: Http) {
        var testCarData = '[{"_id":"59081ad152804f8ec80e0e0f","logo":"/upload/logos/car-logo-bmw.png","chName":"宝马","enName":"BMW","chPinyin":"baoma","series":[]},{"_id":"59081da0f5e0fb4060964c8c","logo":"/upload/logos/car-logo-fiat.png","chName":"法定","enName":"FIAT","chPinyin":"fading","series":[]},{"_id":"59081e1bf5e0fb4060964c8d","logo":"/upload/logos/car-logo-ferrari.png","chName":"法拉利","enName":"FERRARI","chPinyin":"falali","series":[]},{"_id":"59081f02f5e0fb4060964c8e","logo":"/upload/logos/car-logo-jeep.png","chName":"吉普","enName":"JEEP","chPinyin":"jipu","series":[]},{"_id":"59081f8bf5e0fb4060964c8f","logo":"/upload/logos/car-logo-lexus.png","chName":"雷克萨斯","enName":"LEXUS","chPinyin":"leikesasi","series":[]},{"_id":"5908209af5e0fb4060964c90","logo":"/upload/logos/511305.png","chName":"奔驰","enName":"Benz","chPinyin":"benchi","series":[{"seriesLogo":"/upload/seriesLogos/220px-1st_Mercedes-Benz_SLK.jpg","chName":"奔驰SLK","chPinyin":"benchixierke"},{"seriesLogo":"/upload/seriesLogos/220px-Mercedes-Benz_ML_350_BlueTEC_4MATIC_(W_166)_–_Frontansicht,_8._September_2013,_Bösensell.jpg","chName":"奔驰-ML350","chPinyin":"benchimlsanbaiwu"},{"seriesLogo":"/upload/seriesLogos/220px-Mercedes-Benz_G500.jpg","chName":"奔驰G500","chPinyin":"benchijiwubai"}]},{"_id":"590821a48edd8b5418896ae2","logo":"/upload/logos/car-logo-kia.png","chName":"起亚","enName":"KIA","chPinyin":"qiya","series":[]},{"_id":"5908272f8edd8b5418896ae3","logo":"/upload/logos/car-logo-nissan.png","chName":"日产","enName":"NISSAN","chPinyin":"richan","series":[]},{"_id":"59082874d7ce9c8d74b81c39","logo":"/upload/logos/car-logo-skoda.png","chName":"斯柯达","enName":"SKODA","chPinyin":"sikeda","series":[]},{"_id":"59083a4cd7ce9c8d74b81c3b","logo":"/upload/logos/car-logo-vw.png","chName":"大众","enName":"VW","chPinyin":"dazhong","series":[]},{"_id":"59088f993e1ce60dd0f8a155","logo":"/upload/logos/car-logo-volvo.png","chName":"沃尔沃","enName":"VOLVO","chPinyin":"woerwo","series":[]},{"_id":"59098ce5f5e8025eec775b12","logo":"/upload/logos/511289.png","chName":"福特","enName":"FORD","chPinyin":"fute","series":null}]';
        this.http.get(Constant.API_ENDPOINT + '/brands').map(res => res.json()).subscribe(data => {
            if(data && data.length>0) {
              this.carList = data;
            } else {
              this.carList = JSON.parse(testCarData);
            }
            //this.carList = data.data.children;
            //console.log(this.carList);
            this.processCarData();
        });

        this.callback = navParams.get("callback");
        this.trigeerPage = navParams.get("whereIsItFrom");
        if ( this.trigeerPage === 'prepare-sellcar')
          this.allowNoSelectionFlag = false;
        else
          this.allowNoSelectionFlag = true;

        console.log(navParams, ' ', this.trigeerPage, this.allowNoSelectionFlag);
  }

  processCarData() {
    this.carList.sort(this.compare);
    var alphaList = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var mainCars = [];
    this.alphaList = [];
    for(var i=0;i<alphaList.length;i++) {
      var flag = 0;
      for(var j=0;j<this.carList.length;j++) {
        if(alphaList[i] == this.carList[j].enName.substr(0, 1)) {
            if(flag == 0) {
              mainCars.push({
                _id: '0',
                chName: alphaList[i]
              });
              this.alphaList.push(alphaList[i]);
            }
            mainCars.push(this.carList[j]);
            flag = 1;
            continue;
        }
      }
    }

    console.log(mainCars);
    this.mainCars = mainCars;
  }

  compare(a,b) {
    if (a.enName < b.enName)
      return -1;
    if (a.enName > b.enName)
      return 1;
    return 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SellCar');
    //this.carList = this.getBrandAsynch();
  }

  async getBrandAsynch() {
     console.log("asynch data : ", this.sharedService.getBrandList);
     return await this.sharedService.getBrandList;
  }

  clickAlpha(item){
    console.log(item);
    let toast = this.toastCtrl.create({
      message: item,
      duration: 500,
      position: 'middle',
      cssClass: 'alphaToast'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  itemSelected(item) {
    console.log("Selected Item", item);
    if ( item !== '不限品牌') {
      this.currentCar = item;
      this.currentSeries = item.series;
      this.openNav();
    }
    else {
      var carInfo = {brandName: '不限', seriesName: '不限'};
      this.closeNav();

      this.callback(carInfo).then(() => {
        this.navCtrl.pop();
      });
    }
  }

  selectSeries(item) {
      console.log(item);
      var carInfo = this.currentCar;
      if (item === '不限') {
        carInfo.brandName = this.currentCar.chName;
        carInfo.seriesName = '不限';
      }
      else {
        carInfo.brandName = this.currentCar.chName;
        if(item.chName.indexOf(carInfo.chName) > -1) {
          carInfo.seriesName = item.chName;
        } else {
          carInfo.seriesName = carInfo.chName + item.chName;
        }
      }

      this.closeNav();

      this.callback(carInfo).then(() => {
        this.navCtrl.pop();
      });
  }

  openNav() {
      document.getElementById("mySidenav").style.width = "250px";
      $("#mySidenav").width(250);
      $(".sidenav").width(250);

  }

  closeNav() {
      document.getElementById("mySidenav").style.width = "0";
      $("#mySidenav").width(0);
      $(".sidenav").width(0);
  }

}
