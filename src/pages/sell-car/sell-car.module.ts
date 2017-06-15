import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellCar } from './sell-car';

@NgModule({
  declarations: [
    SellCar,
  ],
  imports: [
    IonicPageModule.forChild(SellCar),
  ],
  exports: [
    SellCar
  ]
})
export class SellCarModule {}
