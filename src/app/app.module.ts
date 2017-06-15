import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from 'ionic-native';
import { MyApp } from './app.component';
import { DataService } from '../providers/data-service';
import { SharedService } from '../providers/shared-service';
import { Http, Headers, HttpModule } from '@angular/http';

import { GalleryModal } from 'ionic-gallery-modal';
import { ZoomableImage } from 'ionic-gallery-modal';

import { CarList } from '../components/car-list/car-list';
import { Test } from '../components/test/test';

@NgModule({
  declarations: [
    MyApp,
    GalleryModal,
    ZoomableImage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      backButtonIcon: 'ios-arrow-back',
      iconMode: 'ios',
      pageTransition: 'ios-transition',
      scrollAssist: false,
      autoFocusAssist: false
    }),
    // IonicModule.forRoot(MyApp, { scrollAssist: false, autoFocusAssist: false } ),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GalleryModal,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DataService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SharedService,
    Keyboard
  ]
})
export class AppModule {

}
