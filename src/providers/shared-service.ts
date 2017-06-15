import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { ToastController } from 'ionic-angular';
import 'rxjs/add/operator/map';

import * as Constants from './constants';

@Injectable()
export class SharedService {
  public userLocationCity: string = '';
  public wantedCity: string = '全国';
  public areasData: any;
  public brandData: any;
  public carTypesData: any;

  public carList: any;
  public favoriteList: any;
  public historyList: any;
  public prepareList: any;
  public faqList: any;

  public detailedFilterKey: {
    sort: {price: any, purchasedYear: any, totalDriven: any, uploadedDate: any},
    page: any,
    limit: any,
    status: any,
    carType: any,
    city: any,
    brand: any,
    series: any,
    emissionAmount: any,
    emissionLevel: any,
    carColor: any,
    gearshift: any,
    capability: any,
    fuelOil: any,
    productCountry: any,
    year: {min: string, max: string},
    price: {min: string, max: string},
    totalDriven: {min: string, max: string}
    query: any
  }
  public needInitFilterKey: boolean;

  constructor(public http: Http,
  						public toastCtrl: ToastController ) {
    console.log('Hello SharedService Provider');
    this.areasData = null;
    this.brandData = null;
    this.initFilterKey();
    this.needInitFilterKey = true;
    this.wantedCity = '全国';
  }

  initFilterKey() {
    this.detailedFilterKey = {
      sort: {price: '', purchasedYear: '', totalDriven: '', uploadedDate: ''},
      page: '1',
      limit: '10',
      status: '在商场',
      carType: {chName: '不限'},
      city: '全国',
      brand: {chName: '不限' },
      series: { chName: '不限' },
      emissionAmount: {min: '0', max: '不限'},
      emissionLevel: {emissionLevel: '不限'},
      carColor: {colorName: '不限'},
      gearshift: '不限',
      capability: {capability: '不限'},
      fuelOil: {oilName: '不限'},
      productCountry: {countryName: '不限'},
      year: {min: '0', max: '不限'},
      price: {min: '0', max: '不限'},
      totalDriven: {min: '0', max: '不限'},
      query: ''
    }
  }

  getCityList() {
  	if (this.areasData) {
  		return Promise.resolve(this.areasData);
  	}

  	return new Promise(resolve => {
  	  this.http.get(Constants.API_ENDPOINT + '/areas')
  	    .map(res => res.json())
  	    .subscribe(data => {
  	      this.areasData = data;
  	      resolve(this.areasData);
  	    });
  	});
  }

  getSuggestions() {
  	return new Promise(resolve => {
  	  this.http.get(Constants.API_ENDPOINT + '/suggestiveCar')
  	    .map(res => res.json())
  	    .subscribe(data => {
  	      // this.areasData = data;
  	      resolve(data);
  	    });
  	});
  }

  getCarList() {
  	return new Promise(resolve => {
      console.log('request params : ', this.detailedFilterKey);
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );
      let options = new RequestOptions({ headers: headers });

      this.http.post(Constants.API_ENDPOINT + "/search", this.detailedFilterKey, options)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          this.carList = data;
          resolve(this.carList);
        }, error => {
          console.log(error);// Error getting the data
        });

      });
  }

  getFavoritesWithIds(favorites) {
  	return new Promise(resolve => {
      console.log('request params : ', favorites);
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );
      let options = new RequestOptions({ headers: headers });

      this.http.post(Constants.API_ENDPOINT + "/search", favorites, options)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          resolve(data);
        }, error => {
          console.log(error);// Error getting the data
        });

      });
  }

  // getCarList() {
  //   return new Promise(resolve => {
  //     this.http.get(Constants.API_ENDPOINT + '/search')
  //       .map(res => res.json())
  //       .subscribe(data => {
  //         console.log("cars from server : ", data)
  //         this.brandData = data;
  //         resolve(this.brandData);
  //       });
  //   });
  // }

  getBrandList() {
    if (this.brandData) {
      return Promise.resolve(this.brandData);
    }

    return new Promise(resolve => {
      this.http.get(Constants.API_ENDPOINT + '/brands')
        .map(res => res.json())
        .subscribe(data => {
          this.brandData = data;
          resolve(this.brandData);
        });
    });
  }

  getCarTypes() {
    return new Promise(resolve => {
      this.http.get(Constants.API_ENDPOINT + '/carTypes')
        .map(res => res.json())
        .subscribe(data => {
          this.carTypesData = data[0];
          resolve(this.carTypesData);
        });
    });
  }

  getFaqList() {
    if (this.faqList) {
      return Promise.resolve(this.faqList);
    }

    return new Promise(resolve => {
      this.http.get(Constants.API_ENDPOINT + '/faqs')
        .map(res => res.json())
        .subscribe(data => {
          this.faqList = data;
          resolve(this.faqList);
        });
    });
  }

  getCurrentDateYYYYMMDD() {
    var date = new Date();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();

    return [date.getFullYear(), 
            '-',
            (mm>9 ? '' : '0') + mm,
            '-',
            (dd>9 ? '' : '0') + dd
          ].join('');
  }

  addPriceAlterationNotification(buyerPhone, carId) {
    var requestParam = {
      userPhone: buyerPhone,
      sellcarUDID: carId,
      requestType: '降价通知',
      requestTime: this.getCurrentDateYYYYMMDD(),
      requestStatus: '没完'
    };
  	return new Promise(resolve => {
      console.log('request params for 降价通知: ', requestParam);
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );
      let options = new RequestOptions({ headers: headers });

      this.http.post(Constants.API_ENDPOINT + "/buyer/create", requestParam, options)
        .map(res => res)
        .subscribe(data => {
          resolve(data);
        }, error => {
          resolve({_body: 'fail'});
        });

      });    
  }

  addSellcarRegisterToServer(regParam) {
  	return new Promise(resolve => {
      console.log('request params for 降价通知: ', regParam);
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );
      let options = new RequestOptions({ headers: headers });

      this.http.post(Constants.API_ENDPOINT + "/seller/create", regParam, options)
        .map(res => res)
        .subscribe(data => {
          resolve(data);
        }, error => {
          resolve({_body: 'fail'});
        });

      });
  }

  getFavoriteList() {
    let favoriteList = [];
    let favoriteData = window.localStorage.getItem('favorite');
    if(favoriteData != null && favoriteData != '' && favoriteData != undefined) {
      favoriteList = JSON.parse(favoriteData);
    } else {
      favoriteList = [];
    }
    return favoriteList;
  }

  addCarToFavoriteList(id) {
    let favoriteList = [];
    let favoriteData = window.localStorage.getItem('favorite');
    if(favoriteData != null && favoriteData != '' && favoriteData != undefined) {
      favoriteList = JSON.parse(favoriteData);
    } else {
      favoriteList = [];
    }
    if(favoriteList.indexOf(id) < 0) {
      favoriteList.push(id);
    }
    window.localStorage.setItem('favorite', JSON.stringify(favoriteList));
    this.favoriteList = favoriteList;
  }

  initHistoryList() {
    let historyList = [];
    window.localStorage.setItem('history', JSON.stringify(historyList));
    this.historyList = historyList;
  }

  getHistoryList() {
    let historyList = [];
    let historyData = window.localStorage.getItem('history');
    if(historyData != null && historyData != '' && historyData != undefined) {
      historyList = JSON.parse(historyData);
    } else {
      historyList = [];
    }
    return historyList;
  }

  addCarToHistoryList(id) {
    if (id === null || id === undefined || id === '')
      return;
      
    let historyList = [];
    let historyData = window.localStorage.getItem('history');
    if(historyData != null && historyData != '' && historyData != undefined) {
      historyList = JSON.parse(historyData);
    } else {
      historyList = [];
    }
    if(historyList.indexOf(id) < 0) {
      historyList.push(id);
    }
    window.localStorage.setItem('history', JSON.stringify(historyList));
    this.historyList = historyList;
  }

  getRecordList() {
    let prepareList = [];
    let prepareData = window.localStorage.getItem('record');
    if(prepareData != null && prepareData != '' && prepareData != undefined) {
      prepareList = JSON.parse(prepareData);
    } else {
      prepareList = [];
    }
    return prepareList;
  }

  addCarToRecordList(id) {
    let prepareList = [];
    let prepareData = window.localStorage.getItem('record');
    if(prepareData != null && prepareData != '' && prepareData != undefined) {
      prepareList = JSON.parse(prepareData);
    } else {
      prepareList = [];
    }
    if(prepareList.indexOf(id) < 0) {
      prepareList.push(id);
    }
    window.localStorage.setItem('record', JSON.stringify(prepareList));
    this.prepareList = prepareList;
  }

	presentMiddleToast(message) {
	  let toast = this.toastCtrl.create({
	    message: message,
	    duration: 1000,
  		position: 'middle',
      cssClass: 'prepareToast'
	  });
	  
	  toast.present();
	}
  
}
