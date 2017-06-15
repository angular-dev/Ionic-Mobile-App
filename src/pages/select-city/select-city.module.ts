import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectCity } from './select-city';

@NgModule({
  declarations: [
    SelectCity,
  ],
  imports: [
    IonicPageModule.forChild(SelectCity),
  ],
  exports: [
    SelectCity
  ]
})
export class SelectCityModule {}
