import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, Tabs, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-main-tabs-page',
  templateUrl: 'main-tabs-page.html'
})
@IonicPage()
export class MainTabsPage {
  @ViewChild('mainTabs') tabRef: Tabs;

  tab1Root: any = 'Home';
  tab2Root: any = 'BuyCar';
  tab3Root: any = 'SellCar';
  tab4Root: any = 'Mine';
  selectIndex = "0";

  constructor(public navCtrl: NavController, 
              public events: Events, 
              public navParams: NavParams) {
  	this.events.subscribe('goto:BuyCarPage', event => {
  	  this.tabRef.select(1);
    });
  	this.events.subscribe('goto:SellCarPage', event => {
  	  this.tabRef.select(2);
    });

    if(this.navParams.data.data == 'buycar') {
      this.selectIndex = "1";
    }
    if(this.navParams.data.data == 'sellcar') {
      this.selectIndex = "2";
    }
    if(this.navParams.data.data == 'mine') {
      this.selectIndex = "3";
    }    
  }

}
