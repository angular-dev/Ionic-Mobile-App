import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Record } from './record';

@NgModule({
  declarations: [
    Record
  ],
  imports: [
    IonicPageModule.forChild(Record)
  ],
  exports: [
    Record
  ]
})
export class RecordModule {}
