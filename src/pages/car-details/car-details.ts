import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Events } from 'ionic-angular';
import { ViewChild, ElementRef, Renderer } from '@angular/core';
import { Slides } from 'ionic-angular';

import { SharedService } from '../../providers/shared-service';

import { ModalController } from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal';

@IonicPage()
@Component({
	selector: 'page-car-details',
	templateUrl: 'car-details.html',
})
export class CarDetails {
  	@ViewChild("carImageSlider") carImageSlider: Slides;
  	@ViewChild(Content) content: Content;
  	@ViewChild("navbar", {read: ElementRef}) navbar: ElementRef;
  
    headerBackgroundColor: string = 'transparent';

  carInfo: any;
	carSeries: any;
	// testResult: Array<{
	//   'testCategory': string,
	//   'checkedItems': Number, 
	//   'uncheckedItems': Number
	// }>;
	testResult: any;
	convertedTestResult: [any];


	constructor(public navCtrl: NavController, 
							public navParams: NavParams, 
							private render: Renderer, 
							public sharedService: SharedService,
							private events: Events,
							private modalCtrl: ModalController) {
	  this.headerBackgroundColor = 'transparent';
	  this.carInfo = this.navParams.data;
	  this.carSeries = this.carInfo.series;
	  this.testResult = this.carInfo.testResult;
		if ( this.carInfo._id !== null && this.carInfo._id !== undefined && this.carInfo._id !== '')
	  	sharedService.addCarToHistoryList(this.carInfo._id);

	  console.log("test result : ", this.testResult, ' ', this.testResult.length);
	  this.convertedTestResult = [{}];
	  if (this.testResult.length) {
		for (var index = 0; index < this.testResult.length; index++) {
		  var element = this.testResult[index];
		  var temp = {testCategory: '', checkedItems: 0, uncheckedItems: 0};
		  temp.testCategory = element.testCategory;
		  var checkedNum = 0, uncheckedNum = 0;
		  for (var index1 = 0; index1 < element.categoryItems.length; index1++) {
		    var element1 = element.categoryItems[index1];
		    if (element1['checked'])
		      checkedNum ++;
			else
			  uncheckedNum ++;
		  }
		  temp.checkedItems = checkedNum;
		  temp.uncheckedItems = uncheckedNum;
	      this.convertedTestResult[index] = temp;
		}
	  }
	}

	ionViewDidLoad() {
	  console.log('ionViewDidLoad CarDetails');
	  this.onCarSlideChanged();

	  this.content.ionScroll.subscribe((data)=>{
	  console.log(data);
	  if(data['scrollTop']>0){
	    this.headerBackgroundColor = 'rgba(204, 204, 204, 0.50)';
	  } else {
	    this.headerBackgroundColor = 'transparent';
	  }
	  console.log(this.navbar);
	    this.navbar.nativeElement.style.backgroundColor = this.headerBackgroundColor;
	  })
	}

	addFavorite() {
	  this.sharedService.addCarToFavoriteList(this.carInfo._id);
	  this.sharedService.presentMiddleToast('车辆收藏成功！');
	}

	getHeaderBgColor() {
	  return this.headerBackgroundColor;
	}

	onCallService() {
	  this.events.publish('call:YouchiService');
	}

	onNotification() {
      var phone = window.localStorage.getItem('myphone');
	  if(phone != null && phone != '') {
			this.sharedService.addPriceAlterationNotification(phone, this.carInfo.uniqueId).then(data=>{
				console.log("response from server : ", data['_body']);
				if ( data['_body'] === 'OK')
					this.sharedService.presentMiddleToast('成功！');
				else 
					this.sharedService.presentMiddleToast('失败！');
			});
	  }
	  else {
		  this.sharedService.presentMiddleToast('请登陆');
	  }
	}

	onCarSlideChanged() {
  	  this.carImageSlider.autoplay = 3000;
	  this.carImageSlider.loop = true;
	  this.carImageSlider.autoplayDisableOnInteraction = false;
	  this.carImageSlider.paginationType = 'fraction';
	  this.carImageSlider.pager = true;
  	}

	presentImageGallery(index) {
	  var imageUrls = [{}];
	  var idx = 0
	  this.carInfo.carImages.forEach(element => {
		imageUrls[idx] = {url: element.imagePath};
		idx ++;
	  });
	  console.log("image slide source : ", imageUrls);
	  let modal = this.modalCtrl.create(GalleryModal, {
	    photos: imageUrls,
		initialSlide: index
	  });
	  modal.present();
		
	}

}
