import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController, Config, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SharedService } from '../providers/shared-service';

import * as Constants from '../providers/constants';
import { Keyboard } from 'ionic-native';

declare var BMap, BMAP_STATUS_SUCCESS;
declare var window;
declare var Pushy: any;
declare var screen;
declare var cordova: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = 'MainTabsPage';
  loader: any;

  alert: any;

  constructor(public platform: Platform, 
    public loadingCtrl: LoadingController, 
    public storage: Storage,
    public events: Events,
    private statusBar: StatusBar,
    public sharedService: SharedService,
    private alertCtrl: AlertController,
    public config: Config) {
    
    // let status bar overlay webview
    //this.statusBar.overlaysWebView(true);

    // set status bar to white
    //this.statusBar.backgroundColorByHexString('#ffffff');
  
    // all platforms
    this.config.set( 'scrollPadding', false )
    this.config.set( 'scrollAssist', false )
    this.config.set( 'autoFocusAssist', false )
    // android
    this.config.set( 'android', 'scrollAssist', true )
    this.config.set( 'android', 'autoFocusAssist', 'delay' )

    this.presentLoading();
    
    this.platform.ready().then(() => {

      platform.registerBackButtonAction(() => {
        if (this.nav.canGoBack()){
          this.nav.pop();
        } else {
          if (this.alert){ 
            this.alert.dismiss();
            this.alert =null;     
          } else {
            this.showAlert();
          }
        }
      });

      this.storage.get('introShown').then((result) => {
        if(result) {
          this.rootPage = 'MainTabsPage';
        } else {
          this.rootPage = 'Intro';
          this.storage.set('introShown', true);
        }

        this.loader.dismiss();

      });

      // console.log(this.platform.is('ios'));
      // console.log(this.platform.is('android'));

      if(this.platform.is('ios') == true) {
        if(window.baiduPush) {
            var api_key = 'T5KMG1UMw19KGT5g0p7L9p9O' // your api key 
            window.baiduPush.onMessage(function (result) {
              console.log('onMessage success', result);
              alert(result);
            }, function (error) {
              console.error('onMessage fail', error);
            })
           
            window.baiduPush.onNotificationClicked(function (result) {
              console.log('onNotificationClicked success', result);
            }, function (error) {
              console.error('onNotificationClicked fail', error);
            })
           
            window.baiduPush.onNotificationArrived(function (result) {
              console.log('onNotificationArrived success', result);
            }, function (error) {
              console.error('onNotificationArrived fail', error);
            })
           
            window.baiduPush.startWork(api_key, function (result) {
              console.log('startWork success', result);
              if(result.data && result.data.channelId) {
                window.localStorage.setItem('channelId', result.data.channelId);
              }
            }, function (error) {
              console.error('startWork fail', error);
            })
        }        
      } else if(this.platform.is('android') == true) {
        try {
          // Register the device for push notifications
          Pushy.register(function (err, deviceToken) {
              // Handle registration errors
              if (err) {
                  return console.log(err);
              }

              // Print device token to console
              console.log('Pushy device token: ' + deviceToken);
              window.localStorage.setItem('channelId', deviceToken);

              // Send the token to your backend server via an HTTP GET request
              //await fetch('https://your.api.hostname/register/device?token=' + deviceToken);

              // Succeeded, do something to alert the user
          });

          // Listen for push notifications
          Pushy.setNotificationListener(function (data) {
              // Print notification payload data
              console.log('Received notification: ' + JSON.stringify(data));

              // Display an alert with the "message" payload value
              alert(data.message);
          });        
        } catch(ex) {
          console.log('Push is not defined!');
        }

      }
    });

    this.events.subscribe('goto:CarDetailPage', carInfo => {
      this.openCarDetailsPage(carInfo);
    });
    this.events.subscribe('goto:SelectCityPage', event => {
      this.openSelectCityPage();
    });
    this.events.subscribe('goto:DetailFilterPage', carInfo => {
      this.openDetailFilterPage(carInfo);
    });
    this.events.subscribe('call:YouchiService', event => {
      this.callYouchiService();
    });
    this.events.subscribe('goto:SelectBrandPage', prevPage => {
      this.openSelectBrandPage(prevPage);
    });
    this.events.subscribe('goto:AfterPlanPage', carInfo => {
      this.openAfterPlanPage(carInfo);
    });
    this.events.subscribe('goto:BuyCarPage', event => {
      this.openBuyCarPage();
    });    
    this.events.subscribe('goto:SellCarPage', event => {
      this.openSellCarPage();
    });
    this.events.subscribe('goto:BoughtCarPage', event => {
      this.openBoughtCarPage();
    });
    this.events.subscribe('goto:SoldCarPage', event => {
      this.openSoldCarPage();
    });
    this.events.subscribe('goto:SettingPage', event => {
      this.openSettingPage();
    });
    this.events.subscribe('goto:MinePage', event => {
      this.openMinePage();
    });
    this.events.subscribe('goto:MyFavoritePage', event => {
      this.openMyFavoritePage();
    });
    this.events.subscribe('goto:HistoryPage', event => {
      this.openHistoryPage();
    });
    this.events.subscribe('goto:RecordPage', event => {
      this.openRecordPage();
    });
    this.events.subscribe('goto:BrowsePage', event => {
      this.openBrowsePage();
    });
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "下载..."
    });

    // get location data
  	var geolocation = new BMap.Geolocation();
    var that = this;
  	geolocation.getCurrentPosition(function(r){
  		if(this.getStatus() == BMAP_STATUS_SUCCESS){
        console.log(r);
        that.sharedService.userLocationCity = (r.address.city as string).replace('市', '');
        window.localStorage.setItem('userLocationCity', r.address.city);
  			console.log('您的位置：'+r.point.lng+','+r.point.lat + ', ', r.address);
  		}
  		else {
  			alert('location tracking failed : '+this.getStatus());
  		}
  	},{enableHighAccuracy: true});

    this.loader.present();
  }

  showAlert() {
    this.alert = this.alertCtrl.create({
      title: '退出？',
      message: '您要退出应用程序吗？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            this.alert =null;
          }
        },
        {
          text: '确定',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    this.alert.present();
  }


  openCarDetailsPage(carInfo) {
    this.nav.push('CarDetails', carInfo);
  }

  openSelectCityPage() {
    this.nav.push('SelectCity');
  }

  openDetailFilterPage(carInfo) {
    this.nav.push('DetailFilter', carInfo);
  }

  openAfterPlanPage(carInfo) {
    this.nav.push('AfterPlan', carInfo);
  }

  openSelectBrandPage(prevPage) {
    this.nav.push('SelectBrand', prevPage);
  }

  openBuyCarPage() {
    this.nav.push('MainTabsPage', {'data': 'buycar'}, {animate: true, direction: 'back'});
  }

  openSellCarPage() {
    this.nav.push('MainTabsPage', {'data': 'sellcar'}, {animate: true, direction: 'back'});
  }

  openMinePage() {
    this.nav.push('MainTabsPage', {'data': 'mine'}, {animate: true, direction: 'back'});
  }

  openBoughtCarPage() {
    this.nav.push('BoughtCar');
  }

  openSoldCarPage() {
    this.nav.push('SoldCar');
  }

  openSettingPage() {
    this.nav.push('Setting');
  }

  openMyFavoritePage() {
    this.nav.push('MyFavorite');
  }

  openHistoryPage() {
    this.nav.push('History');
  }

  openRecordPage() {
    this.nav.push('Record');
  }

  openBrowsePage() {
    this.nav.push('Browse');
  }

  callYouchiService() {
    var passedNumber = encodeURIComponent(Constants.SERVICE_PHONE);
    window.open("tel:" + passedNumber);
    console.log('calling');
  }
}

