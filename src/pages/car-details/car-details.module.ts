import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarDetails } from './car-details';

@NgModule({
  declarations: [
    CarDetails,
  ],
  imports: [
    IonicPageModule.forChild(CarDetails),
  ],
  exports: [
    CarDetails
  ]
})
export class CarDetailsModule {}
