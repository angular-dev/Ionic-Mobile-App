import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailFilter } from './detail-filter';

@NgModule({
  declarations: [
    DetailFilter,
  ],
  imports: [
    IonicPageModule.forChild(DetailFilter),
  ],
  exports: [
    DetailFilter
  ]
})
export class DetailFilterModule {}
