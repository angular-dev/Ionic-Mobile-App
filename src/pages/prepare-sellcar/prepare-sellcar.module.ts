import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrepareSellCar } from './prepare-sellcar';

@NgModule({
  declarations: [
    PrepareSellCar,
  ],
  imports: [
    IonicPageModule.forChild(PrepareSellCar),
  ],
  exports: [
    PrepareSellCar
  ]
})
export class PrepareSellCarModule {}
