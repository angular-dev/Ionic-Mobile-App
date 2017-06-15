import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Events, Tabs, Platform, Searchbar } from 'ionic-angular';
import { ViewChild, ElementRef, HostListener } from '@angular/core';
import { SharedService } from '../../providers/shared-service';
import { Cordova } from '@cordova'
import * as Constant from '../../providers/constants';
import { Keyboard } from 'ionic-native';
// import { Keyboard } from '@ionic-native/keyboard';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class Home {
  @ViewChild("promoSlider") promoSlider: Slides;
  @ViewChild("searchabar") searchabar: Searchbar;   
  // @HostListener( 'keydown', ['$event'] )
  //     keyEvent( e )
  //     {
  //         var code = e.keyCode || e.which;
  //         console.log( "HostListener.keyEvent() - code=" + code );
  //         if( code === 13 )
  //         {
  //             console.log( "e.srcElement.tagName=" + e.srcElement.tagName );
  //             if( e.srcElement.tagName === "INPUT" )
  //             {
  //                 console.log( "HostListener.keyEvent() - here" );
  //                 e.preventDefault();
  //                 // this.onEnter();
  //                 Keyboard.close();
  //             }
  //         }
  //     };
  queryString: string;

  slideImgUrl1: string;
  slideImgUrl2: string;
  slideImgUrl3: string;

  sugCarName1: string;
  sugCarName2: string;
  sugCarName3: string;
  sugCarPrice1: string;
  sugCarPrice2: string;
  sugCarPrice3: string;
  sugCarImgUrl1: string;
  sugCarImgUrl2: string;
  sugCarImgUrl3: string;

  suggestionList: any;

  carList: any;

  mainCity: any;
  constructor(public platform: Platform, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events,
    public sharedService: SharedService,
    public keyboard: Keyboard) {
    
    this.events.subscribe('event:MainCitySelected', event => {
      console.log("event catching");
      this.mainCity = this.getSelectedCityAsynch();
      this.sharedService.detailedFilterKey.city = this.mainCity;
      this.ionViewWillEnter();
    })

    this.slideImgUrl1 = Constant.API_ENDPOINT + '/upload/headerBanner/home-banner-1.png';
    this.slideImgUrl2 = Constant.API_ENDPOINT + '/upload/headerBanner/home-banner-2.png';
    this.slideImgUrl3 = Constant.API_ENDPOINT + '/upload/headerBanner/home-banner-3.png';

    this.sugCarImgUrl1 = Constant.API_ENDPOINT + '/upload/headerBanner/suggestion-car-1.png';
    this.sugCarImgUrl2 = Constant.API_ENDPOINT + '/upload/headerBanner/suggestion-car-2.png';
    this.sugCarImgUrl3 = Constant.API_ENDPOINT + '/upload/headerBanner/suggestion-car-3.png';

  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      Keyboard.disableScroll(true);
    });
    this.queryString = '';
  }

  ionViewWillLeave() {
    this.platform.ready().then(() => {
      Keyboard.disableScroll(false);
    });
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad Home');
    this.mainCity = this.getSelectedCityAsynch();
    this.queryString = '';
    this.searchabar.value = ''; // this clears the control value
    this.sharedService.getSuggestions().then(data => {
      if ( data ) {
        this.suggestionList = data as [{}];
        for (var index = 0; index < this.suggestionList.length; index++) {
          var element = this.suggestionList[index];
          if ( element.order === '1' ) {
            this.sugCarName1 = element.chName;
            this.sugCarPrice1 = element.startPrice;
            this.sugCarImgUrl1 = element.imageUrl;
          } else if ( element.order === '2' ) {
            this.sugCarName2 = element.chName;
            this.sugCarPrice2 = element.startPrice;
            this.sugCarImgUrl2 = element.imageUrl;
          } else if ( element.order === '3') {
            this.sugCarName3 = element.chName;
            this.sugCarPrice3 = element.startPrice;
            this.sugCarImgUrl3 = element.imageUrl;
          }
        }
      }
      console.log("suggestions from server : ", this.suggestionList);
    });
    this.sharedService.initFilterKey();
    this.sharedService.detailedFilterKey.city = this.sharedService.wantedCity;
    this.sharedService.getCarList().then(data => {
      this.carList = data['data'];
      console.log("cars from server : ", this.carList);
    });
  }

  search(key) {
    Keyboard.close();
    console.log('serach car with key : ', key);
    this.queryString = key;
    this.sharedService.initFilterKey();
    this.sharedService.detailedFilterKey.query = this.queryString;
    this.sharedService.detailedFilterKey.city = this.sharedService.wantedCity;
    this.carList = [];
    this.sharedService.getCarList().then(data => {
      this.carList = data['data'];
      console.log("cars from server : ", this.carList);
      if (this.carList.length)
        this.sharedService.presentMiddleToast('为了您找到' + this.carList.length + '个车辆');
      else 
        this.sharedService.presentMiddleToast('不好意思， 没找到了');    });
    // this.sharedService.presentMiddleToast('test');

  }

  async getSelectedCityAsynch() {
    console.log("asynch data : ", this.sharedService.wantedCity);
    return await this.sharedService.wantedCity;
  }

  setFilterdItems() {
  	
  }

  onPromoSlideChanged() {
    this.promoSlider.autoplay = 2000;
    this.promoSlider.loop = true;
    this.promoSlider.autoplayDisableOnInteraction = false;
    this.promoSlider.pager = true;
  }

  openCarDetailsPage(event, carInfo) {
    this.events.publish('goto:CarDetailPage', carInfo);
    console.log(carInfo);
    // this.navCtrl.push('CarDetails');
  }

  openBuyCarPage(event) {
    // this.events.publish('goto:BuyCarPage');
    // this.navCtrl.push('CarDetails');
    this.sharedService.initFilterKey();
    this.sharedService.detailedFilterKey.city = this.sharedService.wantedCity;
    switch (event) {
      case '5万以下':
        this.sharedService.detailedFilterKey.price.max = '5';
        break;
      case '5-10万':
        this.sharedService.detailedFilterKey.price.min = '5';
        this.sharedService.detailedFilterKey.price.max = '10';
        break;
      case '10万以上':
        this.sharedService.detailedFilterKey.price.min = '10';
        break;
      case '全部价位':
        this.sharedService.detailedFilterKey.price.max = '0';
        this.sharedService.detailedFilterKey.price.max = '不限';
        break;
      case '桥车': case 'SUV': case '货车':
        this.sharedService.detailedFilterKey.carType.chName = event;
        break;
      case '全部车型':
        this.sharedService.detailedFilterKey.carType.chName = '不限';
        break;
      case '大众': case '宝马': case '奔驰':
        this.sharedService.detailedFilterKey.brand.chName = event;
        break;
      case '全部品牌':
        this.sharedService.detailedFilterKey.brand.chName = '不限';
        break;
      case this.sugCarName1:
        if (this.sugCarName1 && this.sugCarName1 !== '')
          this.sharedService.detailedFilterKey.brand = this.sugCarName1;
      case this.sugCarName2:
        if (this.sugCarName2 && this.sugCarName2 !== '')
          this.sharedService.detailedFilterKey.brand = this.sugCarName2;
      case this.sugCarName3:
        if (this.sugCarName3 && this.sugCarName3 !== '')
          this.sharedService.detailedFilterKey.brand = this.sugCarName3;
      default:
        break;
    }
    if (event !== undefined || event !== '' )
      this.sharedService.needInitFilterKey = false;
    var t: Tabs = this.navCtrl.parent;
    t.select(1);
  }

  openSelectCityPage(event) {
    this.events.publish('goto:SelectCityPage');
  }

  openSellCarPage(event) {
    // this.events.publish('goto:SellCarPage');

    var t: Tabs = this.navCtrl.parent;
    t.select(2);
  }

  callYouchiService(event) {
    this.events.publish('call:YouchiService');
  }
}
