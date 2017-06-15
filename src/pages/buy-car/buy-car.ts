import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { SharedService } from '../../providers/shared-service';
import { ViewChild, ElementRef, HostListener } from '@angular/core';

import * as Constant from '../../providers/constants';
import { Keyboard } from 'ionic-native';


@IonicPage()
@Component({
  selector: 'page-buy-car',
  templateUrl: 'buy-car.html',
  
})
export class BuyCar {
  @ViewChild("searchbar") searchbar: Searchbar;   

  carInfos: any;

  mainCity: any;

  queryString: string;

  sortOverlayHidden: boolean = false;
  selectedSortMode: string = '排序';

  priceOverlayHidden: boolean = false;
  priceScopeBtnText: string = '价格';
  priceScopeStruction: any = { lower: 0, upper: 50 };
  priceScopeDescription: string = '不限';
  selectedPriceScope: string = '不限';

  totalMatchingCarNumber: any;
  currentSearchPageIdx: any;
  searchLimit: any;
  infiniteEnabled: boolean;

  selectedBrand: string = '';
  selectedSeries: string = '';
  brandBtnText: string = '品牌';

  selectedFilterKeyNum = 0;

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
  	          public events: Events, 
              private cdr: ChangeDetectorRef,
              public sharedService: SharedService,
              public keyboard: Keyboard) {

    this.totalMatchingCarNumber = 0;
    this.currentSearchPageIdx = 0;
    this.searchLimit = 10;
    this.selectedPriceScope = '不限';
    this.mainCity = this.getSelectedCityAsynch();
    this.events.subscribe('event:MainCitySelected', event => {
      this.mainCity = this.getSelectedCityAsynch();
      this.sharedService.detailedFilterKey.city = this.mainCity;
      this.ionViewWillEnter();
    });
    this.events.subscribe('filter:FilterChanged', event => {
      console.log("catche event : detail filter changed");
      this.carInfos = [];
      this.mainCity = this.getSelectedCityAsynch();
      // this.mainCity = this.sharedService.detailedFilterKey.city;
      this.sharedService.detailedFilterKey.page = '1';
      this.getCarListFromServer();
    })
    this.infiniteEnabled = false;
  }

  ionViewWillEnter() {
    console.log("showing");
    this.carInfos = [];
    this.sharedService.detailedFilterKey.page = '1';
    this.mainCity = this.getSelectedCityAsynch();
    this.queryString = '';
    this.searchbar.value = ''; // this clears the control value    
    if ( this.sharedService.needInitFilterKey === true )
      this.sharedService.initFilterKey();
    this.sharedService.detailedFilterKey.city = this.sharedService.wantedCity;
    this.sharedService.getCarList().then( data => {
      this.carInfos = data['data'];
      this.currentSearchPageIdx = data['page'];
      this.totalMatchingCarNumber = data['total'];
      this.searchLimit = data['limit'];
      this.checkInfiniteScrollEnable();

      console.log("cars from server : ", this.carInfos);
      this.sharedService.needInitFilterKey = true;
    });
    this.setSubMenuTitlesFromKeySetting();
  }

  setSubMenuTitlesFromKeySetting() {
    if( this.sharedService.detailedFilterKey.price.min === '0' && this.sharedService.detailedFilterKey.price.max === '不限' )
      this.priceScopeBtnText = '不限价格';
    else if ( this.sharedService.detailedFilterKey.price.min === '0' && this.sharedService.detailedFilterKey.price.max !== '不限' )
      this.priceScopeBtnText = this.sharedService.detailedFilterKey.price.max + '万以下';
    else if ( this.sharedService.detailedFilterKey.price.min !== '0' && this.sharedService.detailedFilterKey.price.max !== '不限' )
      this.priceScopeBtnText = this.sharedService.detailedFilterKey.price.min + '-' + this.sharedService.detailedFilterKey.price.max + '万';
    else if ( this.sharedService.detailedFilterKey.price.min !== '0' && this.sharedService.detailedFilterKey.price.max === '不限' ) {
      this.priceScopeBtnText = this.sharedService.detailedFilterKey.price.min + '万以上';
    }
    if ( this.priceScopeBtnText === '0万以上')
      this.priceScopeBtnText = '不限价格';

    if ( this.sharedService.detailedFilterKey.brand['chName'] === '不限' )
      this.brandBtnText = '不限品牌';
    else
      this.brandBtnText = this.sharedService.detailedFilterKey.brand['chName'];
    
    if ( this.sharedService.detailedFilterKey.series['chName'] !== '不限' )
      this.brandBtnText = this.sharedService.detailedFilterKey.series['chName'];
      
    this.getSelectedFilterKeyNum();
  }

  getSelectedFilterKeyNum() {
    this.selectedFilterKeyNum = 0;
    // car type
    if ( this.sharedService.detailedFilterKey.carType.chName !== '不限')
      this.selectedFilterKeyNum += 1;
    // city
    if ( this.sharedService.detailedFilterKey.city !== '全国' )
      this.selectedFilterKeyNum += 1;
    // brand series
    if ( this.sharedService.detailedFilterKey.brand.chName !== '不限' || 
         this.sharedService.detailedFilterKey.series.chName !== '不限' )
      this.selectedFilterKeyNum += 1;
    // emission amount
    if ( !(this.sharedService.detailedFilterKey.emissionAmount.min === '0' && 
         this.sharedService.detailedFilterKey.emissionAmount.max === '不限') )
      this.selectedFilterKeyNum += 1;
    // emission level
    if ( this.sharedService.detailedFilterKey.emissionLevel.emissionLevel !== '不限' )
      this.selectedFilterKeyNum += 1;
    // color
    if ( this.sharedService.detailedFilterKey.carColor.colorName !== '不限' )
      this.selectedFilterKeyNum += 1;
    // gear
    if ( this.sharedService.detailedFilterKey.gearshift !== '不限' )
      this.selectedFilterKeyNum += 1;
    // capability
    if ( this.sharedService.detailedFilterKey.capability.capability !== '不限' )
      this.selectedFilterKeyNum += 1;
    // oil
    if ( this.sharedService.detailedFilterKey.fuelOil.oilName !== '不限' )
      this.selectedFilterKeyNum += 1;
    // product country
    if ( this.sharedService.detailedFilterKey.productCountry.countryName !== '不限' )
      this.selectedFilterKeyNum += 1;
    // car year
    if ( !(this.sharedService.detailedFilterKey.year.min === '0' && 
         this.sharedService.detailedFilterKey.year.max === '不限') )
      this.selectedFilterKeyNum += 1;
    // price
    if ( !(this.sharedService.detailedFilterKey.price.min === '0' && 
         this.sharedService.detailedFilterKey.price.max === '不限') )
      this.selectedFilterKeyNum += 1;
    // total driven
    if ( !(this.sharedService.detailedFilterKey.totalDriven.min === '0' && 
         this.sharedService.detailedFilterKey.totalDriven.max === '不限') )
      this.selectedFilterKeyNum += 1;
    return this.selectedFilterKeyNum;
  }

  refreshCarList(refresher) {
    console.log('Begin async operation', refresher);
    // this.carInfos = [];
    this.sharedService.detailedFilterKey.page = '1';
    this.sharedService.getCarList().then( data=> {
      this.carInfos = data['data'];
      this.currentSearchPageIdx = data['page'];
      this.totalMatchingCarNumber = data['total'];
      this.searchLimit = data['limit'];
      console.log("cars from server : ", this.carInfos);

      if (this.totalMatchingCarNumber > this.currentSearchPageIdx * this.searchLimit) {
        this.infiniteEnabled = true;
      }
      else {
        this.infiniteEnabled = false;
      }

      refresher.complete();
    })
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 5000);

  }

  clearSearch() {
    this.search('');
  }

  search(key) {
    Keyboard.close();
    console.log('serach car with key : ', key);
    this.queryString = key;
    this.sharedService.initFilterKey();
    this.sharedService.detailedFilterKey.query = this.queryString;
    this.sharedService.detailedFilterKey.city = this.sharedService.wantedCity;
    this.carInfos = [];
    this.sharedService.getCarList().then(data => {
      this.carInfos = data['data'];
      console.log("cars from server : ", this.carInfos);
      this.currentSearchPageIdx = data['page'];
      this.totalMatchingCarNumber = data['total'];
      this.searchLimit = data['limit'];
      console.log("cars from server : ", this.carInfos);

      if (this.totalMatchingCarNumber > this.currentSearchPageIdx * this.searchLimit) {
        this.infiniteEnabled = true;
      }
      else {
        this.infiniteEnabled = false;
      }
      
      if (this.carInfos.length)
        this.sharedService.presentMiddleToast('为了您找到' + this.totalMatchingCarNumber + '个车辆');
      else 
        this.sharedService.presentMiddleToast('不好意思， 没找到了');
      
    });
  }

  doInfiniteCar(infiniteScroll) {
    console.log('Infinite scroll Begin async operation');
    if (this.totalMatchingCarNumber > this.currentSearchPageIdx * this.searchLimit) {
      this.sharedService.detailedFilterKey.page = this.currentSearchPageIdx + 1;
      this.sharedService.getCarList().then( data => {
        this.carInfos.push.apply(this.carInfos, data['data']);
        this.currentSearchPageIdx = data['page'];
        this.totalMatchingCarNumber = data['total'];
        this.searchLimit = data['limit'];
        console.log("cars from server added as infinet: ", this.carInfos);
        this.checkInfiniteScrollEnable();
        infiniteScroll.complete();
      });
    }
    
    setTimeout(() => {
        console.log('Infinite scroll Async operation has ended');
        infiniteScroll.complete();
    }, 5000);    
  }

  checkInfiniteScrollEnable() {
      if (this.totalMatchingCarNumber > this.currentSearchPageIdx * this.searchLimit) {
        this.infiniteEnabled = true;
      }
      else {
        this.infiniteEnabled = false;
      }
  }

  async getSelectedCityAsynch() {
    console.log("asynch data : ", this.sharedService.wantedCity);
    return await this.sharedService.wantedCity;
  }

  openCarDetailsPage(event, carInfo) {
  	this.events.publish('goto:CarDetailPage', carInfo);
  	// this.navCtrl.push('CarDetails');
  }

  public hideUnifSortOverlay() {
    this.sortOverlayHidden = !this.sortOverlayHidden;
    if (this.priceOverlayHidden)
      this.priceOverlayHidden = false;
  }
  
  setBrandSericesFilter = (_params) => {
    return new Promise((resolve, reject) => {
        this.selectedBrand = _params.brandName;
        this.selectedSeries = _params.seriesName;
        console.log("selected brand series : ", _params);

        this.sharedService.needInitFilterKey = false;
        this.carInfos = [];
        this.sharedService.detailedFilterKey.page = '1';
        this.sharedService.detailedFilterKey.series = { chName: this.selectedSeries};
        this.sharedService.detailedFilterKey.brand = { chName: this.selectedBrand};
        this.brandBtnText = this.selectedBrand;
        this.getCarListFromServer();

        resolve();

    });
  }

  openBrandSelectionPage() {
    if (this.priceOverlayHidden)
      this.priceOverlayHidden = false;
    if (this.sortOverlayHidden)
      this.sortOverlayHidden = false;
    
    this.navCtrl.push('SelectBrand', {callback: this.setBrandSericesFilter})
  }

  public hidePriceSortOverlay() {
    this.priceOverlayHidden = !this.priceOverlayHidden;
    if (this.sortOverlayHidden)
      this.sortOverlayHidden = false;
  }
  
  getCarListFromServer() {
    this.sharedService.getCarList().then( data=> {
      this.carInfos = data['data'];
      this.currentSearchPageIdx = data['page'];
      this.totalMatchingCarNumber = data['total'];
      this.searchLimit = data['limit'];
      console.log("cars from server : ", this.carInfos);

      this.setSubMenuTitlesFromKeySetting();

      if (this.totalMatchingCarNumber > this.currentSearchPageIdx * this.searchLimit) {
        this.infiniteEnabled = true;
      }
      else {
        this.infiniteEnabled = false;
      }
      this.sharedService.needInitFilterKey = true;
    });
  }

  onIntelligentSort() {
    this.selectedSortMode = '智能排序';
    this.sortOverlayHidden = !this.sortOverlayHidden;

    this.carInfos = [];
    this.sharedService.detailedFilterKey.page = '1';
    this.sharedService.detailedFilterKey.sort.uploadedDate = '';
    this.sharedService.detailedFilterKey.sort.price = '';
    this.sharedService.detailedFilterKey.sort.totalDriven = '';
    this.sharedService.detailedFilterKey.sort.purchasedYear = '';
    this.getCarListFromServer();
  }

  onRecentSort() {
    this.selectedSortMode = '最新上架';

    this.sortOverlayHidden = !this.sortOverlayHidden;

    this.carInfos = [];
    this.sharedService.detailedFilterKey.sort.uploadedDate = 'asc';
    this.sharedService.detailedFilterKey.sort.price = '';
    this.sharedService.detailedFilterKey.sort.totalDriven = '';
    this.sharedService.detailedFilterKey.sort.purchasedYear = '';
    this.sharedService.detailedFilterKey.page = '1';
    this.getCarListFromServer();

  }

	onCheapestSort() {
    this.selectedSortMode = '价格最低';

    this.sortOverlayHidden = !this.sortOverlayHidden;

    this.carInfos = [];
    this.sharedService.detailedFilterKey.sort.uploadedDate = '';
    this.sharedService.detailedFilterKey.sort.price = 'asc';
    this.sharedService.detailedFilterKey.sort.totalDriven = '';
    this.sharedService.detailedFilterKey.sort.purchasedYear = '';
    this.sharedService.detailedFilterKey.page = '1';
    this.getCarListFromServer();

  }
	
  onExpensiveSort() {
    this.selectedSortMode = '价格最高';

    this.sortOverlayHidden = !this.sortOverlayHidden;

    this.carInfos = [];
    this.sharedService.detailedFilterKey.sort.uploadedDate = '';
    this.sharedService.detailedFilterKey.sort.price = 'desc';
    this.sharedService.detailedFilterKey.sort.totalDriven = '';
    this.sharedService.detailedFilterKey.sort.purchasedYear = '';
    this.sharedService.detailedFilterKey.page = '1';
    this.getCarListFromServer();
  }  
	
  onMinYearSort() {
    this.selectedSortMode = '车龄最短';

    this.sortOverlayHidden = !this.sortOverlayHidden;

    this.carInfos = [];
    this.sharedService.detailedFilterKey.sort.uploadedDate = '';
    this.sharedService.detailedFilterKey.sort.price = '';
    this.sharedService.detailedFilterKey.sort.totalDriven = '';
    this.sharedService.detailedFilterKey.sort.purchasedYear = 'asc';
    this.sharedService.detailedFilterKey.page = '1';
    this.getCarListFromServer();
  }  
		
  onMinDrivenSort() {
    this.selectedSortMode = '里程最小';

    this.sortOverlayHidden = !this.sortOverlayHidden;

    this.carInfos = [];
    this.sharedService.detailedFilterKey.sort.uploadedDate = '';
    this.sharedService.detailedFilterKey.sort.price = '';
    this.sharedService.detailedFilterKey.sort.totalDriven = 'asc';
    this.sharedService.detailedFilterKey.sort.purchasedYear = '';
    this.sharedService.detailedFilterKey.page = '1';
    this.getCarListFromServer();
  }  

  updateScopeDesc(data) {
    if( this.priceScopeStruction.lower === 0 && this.priceScopeStruction.upper === 50 )
      this.priceScopeDescription = '不限';
    else if ( this.priceScopeStruction.lower === 0 && this.priceScopeStruction.upper < 50 )
      this.priceScopeDescription = this.priceScopeStruction.upper + '万以下';
    else if ( this.priceScopeStruction.lower !== 0 && this.priceScopeStruction.upper < 50 )
      this.priceScopeDescription = this.priceScopeStruction.lower + '-' + this.priceScopeStruction.upper + '万';
    else if ( this.priceScopeStruction.lower !== 0 && this.priceScopeStruction.upper === 50 )
      this.priceScopeDescription = this.priceScopeStruction.lower + '万以上';

  }

  getCarListFromServerWithPriceScope(min, max) {
    this.sharedService.detailedFilterKey.price.min = min;
    this.sharedService.detailedFilterKey.price.max = max;

    this.carInfos = [];
    this.sharedService.detailedFilterKey.page = '1';
    this.getCarListFromServer();
  }

  onPriceButton(event) {
    console.log("event data: ", event);
    this.selectedPriceScope = event;
    this.priceScopeBtnText = event;
    switch (event) {
      case '不限':
        this.priceScopeStruction = { lower: 0, upper: 50 };
        this.priceScopeDescription = '不限';
        this.priceScopeBtnText = '不限价格';
        this.getCarListFromServerWithPriceScope(0, '不限');
        break;
      case '3万以下':
        this.priceScopeStruction = { lower: 3, upper: 50 };
        this.priceScopeDescription = '3万以下';
        this.getCarListFromServerWithPriceScope(0, 3);
        break;
      case '3-5万':
        this.priceScopeStruction = { lower: 3, upper: 5 };
        this.priceScopeDescription = '3-5万';
        this.getCarListFromServerWithPriceScope(3, 5);
        break;
      case '5-7万':
        this.priceScopeStruction = { lower: 5, upper: 7 };
        this.priceScopeDescription = '5-7万';
        this.getCarListFromServerWithPriceScope(5, 7);
        break;
      case '7-9万':
        this.priceScopeStruction = { lower: 7, upper: 9 };
        this.priceScopeDescription = '7-9万';
        this.getCarListFromServerWithPriceScope(7, 9);
        break;
      case '9-12万':
        this.priceScopeStruction = { lower: 9, upper: 12 };
        this.priceScopeDescription = '9-12万';
        this.getCarListFromServerWithPriceScope(9, 12);
        break;
      case '12-16万':
        this.priceScopeStruction = { lower: 12, upper: 16 };
        this.priceScopeDescription = '12-16万';
        this.getCarListFromServerWithPriceScope(12, 16);
        break;
      case '16-20万':
        this.priceScopeStruction = { lower: 16, upper: 20 };
        this.priceScopeDescription = '16-20万';
        this.getCarListFromServerWithPriceScope(16, 20);
        break;
      case '20万以上':
        this.priceScopeStruction = { lower: 20, upper: 50 };
        this.priceScopeDescription = '20万以上';
        this.getCarListFromServerWithPriceScope(20, '不限');
        break;
    
      default:
        break;
    }
    this.priceOverlayHidden = false;
  }

  onPriceConfirmBtn() {
    this.priceScopeBtnText = this.priceScopeDescription;
    if (this.priceScopeBtnText === '不限')
      this.priceScopeBtnText = '不限价格';
    this.priceOverlayHidden = false;

    if (this.priceScopeStruction.uppper === 50)
      this.getCarListFromServerWithPriceScope(this.priceScopeStruction.lower, '不限');
    else
      this.getCarListFromServerWithPriceScope(this.priceScopeStruction.lower, this.priceScopeStruction.upper);
  }

  openSelectCityPage() {
    if (this.sortOverlayHidden)
      this.sortOverlayHidden = false;
    if (this.priceOverlayHidden)
      this.priceOverlayHidden = false;
    this.events.publish('goto:SelectCityPage');
  }

  openDetailFilterPage() {
    if (this.sortOverlayHidden)
      this.sortOverlayHidden = false;
    if (this.priceOverlayHidden)
      this.priceOverlayHidden = false;
    this.events.publish('goto:DetailFilterPage');
  }
  
}
