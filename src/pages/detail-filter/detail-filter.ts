import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { SharedService } from '../../providers/shared-service';

import * as Constant from '../../providers/constants';

@IonicPage()
@Component({
  selector: 'page-detail-filter',
  templateUrl: 'detail-filter.html',
})
export class DetailFilter {
  carTypeData: any;

  selectedCarType: string = '不限';
  selectedCity: string = '全国';
  selectedBrand: string = '不限';
  selectedSeries: string = '不限';
  selectedEmissionAmount: string = '';
  selectedEmissionLevel: string = '不限';
  selectedColor: string = '不限';
  selectedGear: string = '不限';
  selectedCapability: string = '不限';
  selectedOil: string = '不限';
  selectedCountry: string = '不限';

  yearsScopeStruction: any = { lower: 0, upper: 6 };
  yearsScopeDescription: string = '不限';

  priceScopeStruction: any = { lower: 0, upper: 60 };
  priceScopeDescription: string = '不限';

  drivenScopeStruction: any = { lower: 0, upper: 15 };
  drivenScopeDescription: string = '不限';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public sharedService: SharedService,
              public events: Events) {
    
    this.selectedCity = this.sharedService.wantedCity;

    this.sharedService.getCarTypes().then(data => {
      this.carTypeData = data;
    });

  }

  initFilterKey() {
    this.sharedService.initFilterKey();
    // this.sharedService.detailedFilterKey.city.chName = this.sharedService.wantedCity;
    this.getDetailFilterKeys();
  }

  setCityFilter = (_params) => {
    return new Promise((resolve, reject) => {
        this.selectedCity = _params;
        console.log("selected city : ", _params);
        resolve();
    });
  }

  setBrandSeriesFilter = (_params) => {
    return new Promise((resolve, reject) => {
        this.selectedBrand = _params['brandName'];
        this.selectedSeries = _params['seriesName'];
        console.log("selected brand series : ", _params);
        resolve();
    });
  }

  ionViewDidLoad() {
    this.sharedService.getCarTypes().then(data => {
      this.carTypeData = data;
    });
    this.getDetailFilterKeys();
  }

  updateYearsScopeDesc() {
    if( this.yearsScopeStruction.lower === 0 && this.yearsScopeStruction.upper === 6 )
      this.yearsScopeDescription = '不限';
    else if ( this.yearsScopeStruction.lower === 0 && this.yearsScopeStruction.upper < 6 )
      this.yearsScopeDescription = this.yearsScopeStruction.upper + '年以内';
    else if ( this.yearsScopeStruction.lower !== 0 && this.yearsScopeStruction.upper < 6 )
      this.yearsScopeDescription = this.yearsScopeStruction.lower + '-' + this.yearsScopeStruction.upper + '年';
    else if ( this.yearsScopeStruction.lower !== 0 && this.yearsScopeStruction.upper === 6 )
      this.yearsScopeDescription = this.yearsScopeStruction.lower + '年以上';
  }

  updatePriceScopeDesc() {
    if( this.priceScopeStruction.lower === 0 && this.priceScopeStruction.upper === 60 )
      this.priceScopeDescription = '不限';
    else if ( this.priceScopeStruction.lower === 0 && this.priceScopeStruction.upper < 60 )
      this.priceScopeDescription = this.priceScopeStruction.upper + '万以内';
    else if ( this.priceScopeStruction.lower !== 0 && this.priceScopeStruction.upper < 60 )
      this.priceScopeDescription = this.priceScopeStruction.lower + '-' + this.priceScopeStruction.upper + '万';
    else if ( this.priceScopeStruction.lower !== 0 && this.priceScopeStruction.upper === 60 )
      this.priceScopeDescription = this.priceScopeStruction.lower + '万以上';
  }

  updateDrivenScopeDesc() {
    if( this.drivenScopeStruction.lower === 0 && this.drivenScopeStruction.upper === 15 )
      this.drivenScopeDescription = '不限';
    else if ( this.drivenScopeStruction.lower === 0 && this.drivenScopeStruction.upper < 15 )
      this.drivenScopeDescription = this.drivenScopeStruction.upper + '万公里以内';
    else if ( this.drivenScopeStruction.lower !== 0 && this.drivenScopeStruction.upper < 15 )
      this.drivenScopeDescription = this.drivenScopeStruction.lower + '-' + this.drivenScopeStruction.upper + '万公里';
    else if ( this.drivenScopeStruction.lower !== 0 && this.drivenScopeStruction.upper === 15 )
      this.drivenScopeDescription = this.drivenScopeStruction.lower + '万公里以上';
  }

  onSelectCarType(carType) {
    this.selectedCarType = carType;
  }

  onSelectEmissionAmount(amount) {
    this.selectedEmissionAmount = amount;
  }

  onSelectEmissionLevel(level) {
    this.selectedEmissionLevel = level;
  }

  onSelectColor(color) {
    this.selectedColor = color;
  }

  onSelectGear(gear) {
    this.selectedGear = gear;
  }

  onSelectCapability(capability) {
    this.selectedCapability = capability;
  }

  onSelectOil(oilName) {
    this.selectedOil = oilName;
  }

  onSelectCountry(countryName) {
    this.selectedCountry = countryName;
  }

  onSelectCity() {
    this.navCtrl.push('SelectCity', { citySelectionPublish: false, callback: this.setCityFilter })
  }

  onSelectBrand() {
    this.navCtrl.push('SelectBrand', { callback: this.setBrandSeriesFilter } );
    // this.events.publish('goto:SelectBrandPage', {'prevpage': 'detail-filter'});
  }

  onSaveFilter() {
    console.log("publish event : detail filter changed");

    this.setDetailFilterKeys();
    this.sharedService.wantedCity = this.selectedCity;
    this.events.publish('filter:FilterChanged');
    this.navCtrl.pop();
  }

  onViewResult() {
    console.log("publish event : detail filter changed");
    this.setDetailFilterKeys();
    this.sharedService.wantedCity = this.selectedCity;
    this.events.publish('filter:FilterChanged');
    this.navCtrl.pop();
  }

  getDetailFilterKeys() {
    console.log("filter key : ", this.sharedService.detailedFilterKey);
    this.selectedCarType = this.sharedService.detailedFilterKey.carType.chName;
    this.selectedBrand = this.sharedService.detailedFilterKey.brand.chName;
    this.selectedSeries = this.sharedService.detailedFilterKey.series.chName;
    // year
    if (this.sharedService.detailedFilterKey.year.max === '不限')
      this.yearsScopeStruction = {lower: parseInt(this.sharedService.detailedFilterKey.year.min), upper: 6};
    else
      this.yearsScopeStruction = {lower: parseInt(this.sharedService.detailedFilterKey.year.min), upper: parseInt(this.sharedService.detailedFilterKey.year.max)};

    // price
    if (this.sharedService.detailedFilterKey.price.max === '不限')
      this.priceScopeStruction = {lower: parseInt(this.sharedService.detailedFilterKey.price.min), upper: 60};
    else
      this.priceScopeStruction = {lower: parseInt(this.sharedService.detailedFilterKey.price.min), upper: parseInt(this.sharedService.detailedFilterKey.price.max)};
    
    // total driven
    if (this.sharedService.detailedFilterKey.totalDriven.max === '不限')
      this.drivenScopeStruction = {lower: parseInt(this.sharedService.detailedFilterKey.totalDriven.min), upper: 15};
    else
      this.drivenScopeStruction = {lower: parseInt(this.sharedService.detailedFilterKey.totalDriven.min), upper: parseInt(this.sharedService.detailedFilterKey.totalDriven.max)};

    // emission amount
    if ( this.sharedService.detailedFilterKey.emissionAmount.min === '0' && 
         this.sharedService.detailedFilterKey.emissionAmount.max === '不限')
        this.selectedEmissionAmount = '不限';
    else if ( this.sharedService.detailedFilterKey.emissionAmount.min === '0' && 
         this.sharedService.detailedFilterKey.emissionAmount.max === '1')
        this.selectedEmissionAmount = '1.0L一下';
    else if ( this.sharedService.detailedFilterKey.emissionAmount.min === '1.1' && 
         this.sharedService.detailedFilterKey.emissionAmount.max === '1.6')
        this.selectedEmissionAmount = '1.1-1.6L';
    else if ( this.sharedService.detailedFilterKey.emissionAmount.min === '1.7' && 
         this.sharedService.detailedFilterKey.emissionAmount.max === '2.0')
        this.selectedEmissionAmount = '1.7-2.0L';
    else if ( this.sharedService.detailedFilterKey.emissionAmount.min === '2.1' && 
         this.sharedService.detailedFilterKey.emissionAmount.max === '2.5')
        this.selectedEmissionAmount = '2.1-2.5L';
    else if ( this.sharedService.detailedFilterKey.emissionAmount.min === '2.6' && 
         this.sharedService.detailedFilterKey.emissionAmount.max === '3.0')
        this.selectedEmissionAmount = '2.6-3.0L';
    else if ( this.sharedService.detailedFilterKey.emissionAmount.min === '3.1' && 
         this.sharedService.detailedFilterKey.emissionAmount.max === '4.0')
        this.selectedEmissionAmount = '3.1-4.0L';
    else if ( this.sharedService.detailedFilterKey.emissionAmount.min === '4.0' && 
         this.sharedService.detailedFilterKey.emissionAmount.max === '不限')
        this.selectedEmissionAmount = '4.0L以上';

    this.selectedEmissionLevel = this.sharedService.detailedFilterKey.emissionLevel.emissionLevel;
    this.selectedColor = this.sharedService.detailedFilterKey.carColor.colorName;
    this.selectedGear = this.sharedService.detailedFilterKey.gearshift;
    this.selectedCapability = this.sharedService.detailedFilterKey.capability.capability;
    this.selectedOil = this.sharedService.detailedFilterKey.fuelOil.oilName;
    this.selectedCountry = this.sharedService.detailedFilterKey.productCountry.countryName;
  }
  
  setDetailFilterKeys() {
    // save filter key
    this.sharedService.detailedFilterKey.city = this.selectedCity;
    this.sharedService.detailedFilterKey.carType = { chName: this.selectedCarType };
    this.sharedService.detailedFilterKey.brand = { chName: this.selectedBrand};
    this.sharedService.detailedFilterKey.series = { chName: this.selectedSeries };
    this.sharedService.detailedFilterKey.emissionLevel = { emissionLevel: this.selectedEmissionLevel};
    this.sharedService.detailedFilterKey.carColor = { colorName: this.selectedColor };
    this.sharedService.detailedFilterKey.gearshift = this.selectedGear;
    this.sharedService.detailedFilterKey.capability ={ capability: this.selectedCapability };
    this.sharedService.detailedFilterKey.fuelOil = { oilName: this.selectedOil };
    this.sharedService.detailedFilterKey.productCountry = { countryName: this.selectedCountry };
    
    if ( this.yearsScopeStruction.upper === 6 )
      this.sharedService.detailedFilterKey.year = { min: "" + this.yearsScopeStruction.lower, max: '不限' };
    else
      this.sharedService.detailedFilterKey.year = { min: "" + this.yearsScopeStruction.lower, max: "" + this.yearsScopeStruction.upper };
    
    if ( this.priceScopeStruction.upper === 60 )
      this.sharedService.detailedFilterKey.price = { min: "" + this.priceScopeStruction.lower, max: '不限' };
    else
      this.sharedService.detailedFilterKey.price = { min: "" + this.priceScopeStruction.lower, max: "" + this.priceScopeStruction.upper };
    
    if ( this.drivenScopeStruction.upper === 15 )
      this.sharedService.detailedFilterKey.totalDriven = { min: "" + this.drivenScopeStruction.lower, max: '不限' };
    else
      this.sharedService.detailedFilterKey.totalDriven = { min: "" + this.drivenScopeStruction.lower, max: "" + this.drivenScopeStruction.upper };
    
    
    switch (this.selectedEmissionAmount) {
      case '不限':
        this.sharedService.detailedFilterKey.emissionAmount = {min: '0', max: '不限'};
        break;
      case '1.0L一下':
        this.sharedService.detailedFilterKey.emissionAmount = {min: '0', max: '1'};
        break;
      case '1.1-1.6L':
        this.sharedService.detailedFilterKey.emissionAmount = {min: '1.1', max: '1.6'};
        break;
      case '1.7-2.0L':
        this.sharedService.detailedFilterKey.emissionAmount = {min: '1.7', max:'2.0'};
        break;
      case '2.1-2.5L':
        this.sharedService.detailedFilterKey.emissionAmount = {min: '2.1', max: '2.5'};
        break;
      case '2.6-3.0L':
        this.sharedService.detailedFilterKey.emissionAmount = {min: '2.6', max: '3.0'};
        break;
      case '3.1-4.0L':
        this.sharedService.detailedFilterKey.emissionAmount = {min: '3.1', max: '4.0'};
        break;
      case '4.0L以上':
        this.sharedService.detailedFilterKey.emissionAmount = {min: '4.0', max: '不限'};
        break;
      default:
        break;
    }
  }
}
