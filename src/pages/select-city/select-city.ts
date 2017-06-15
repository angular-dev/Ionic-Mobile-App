import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Input, Output, EventEmitter } from 'angular2/core';
import { SharedService } from '../../providers/shared-service';

@IonicPage()
@Component({
  selector: 'page-select-city',
  templateUrl: 'select-city.html',
})
export class SelectCity {
  cities: any;
  currentPosition: any;
  groupedCities = [];

  citySelectionPublish: boolean = true;
  callback: any;

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
  	          public events: Events,
              public sharedService: SharedService) {

      this.citySelectionPublish = navParams.get('citySelectionPublish');
      console.log("citySelectionPublish : ", this.citySelectionPublish);
      this.callback = navParams.get("callback");
  }

  ionViewDidLoad() {
    this.currentPosition = this.sharedService.userLocationCity;

    this.sharedService.getCityList().then(cityList => {
      console.log("city list : ", cityList);
      this.cities = cityList;
      this.groupCities(this.cities);
    });
  }

  groupCities(cities){

    let sortedCities = cities.sort((n1, n2) => {
      if(n1.chPinyin < n2.chPinyin) return -1;
      if(n1.chPinyin > n2.chPinyin) return 1;
      return 0;
    });
    let currentLetter = false;
    let currentCities = [];

    sortedCities.forEach((value, index) => {

      if(value.chPinyin.charAt(0) != currentLetter){

        currentLetter = value.chPinyin.charAt(0);

        let newGroup = {
          letter: currentLetter,
          cities: []
        };

        currentCities = newGroup.cities;
        this.groupedCities.push(newGroup);

      } 

      currentCities.push(value);

    });

  }

  selectedCity(event, selectedCity) {
    if ( this.citySelectionPublish === false ) {
      console.log('event do not publish : ');
      this.callback(selectedCity).then(() => {
        this.navCtrl.pop();
      });
    }
    else {
      console.log('event publish : ');
      this.sharedService.wantedCity = selectedCity;
      this.mainCitySelected(event);
      this.navCtrl.pop();
    }
  }

  mainCitySelected(event) {
    this.events.publish('event:MainCitySelected');
  }

 
}
