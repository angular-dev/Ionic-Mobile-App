import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BoughtCar } from './bought-car';

@NgModule({
  declarations: [
    BoughtCar
  ],
  imports: [
    IonicPageModule.forChild(BoughtCar),
  ],
  exports: [
    BoughtCar
  ]
})
export class BoughtCarModule {}
