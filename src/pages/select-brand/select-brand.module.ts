import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectBrand } from './select-brand';

@NgModule({
  declarations: [
    SelectBrand,
  ],
  imports: [
    IonicPageModule.forChild(SelectBrand),
  ],
  exports: [
    SelectBrand
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SelectBrandModule {}
