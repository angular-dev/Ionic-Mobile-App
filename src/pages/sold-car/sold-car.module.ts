import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SoldCar } from './sold-car';

@NgModule({
  declarations: [
    SoldCar,
  ],
  imports: [
    IonicPageModule.forChild(SoldCar),
  ],
  exports: [
    SoldCar
  ]
})
export class SoldCarModule {}
