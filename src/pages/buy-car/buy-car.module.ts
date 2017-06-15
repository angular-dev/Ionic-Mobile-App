import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuyCar } from './buy-car';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    BuyCar,
  ],
  imports: [
    IonicPageModule.forChild(BuyCar),
    ComponentsModule,
  ],
  exports: [
    BuyCar
  ]
})
export class BuyCarModule {}
