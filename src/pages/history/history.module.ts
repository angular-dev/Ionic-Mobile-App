import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { History } from './history';

@NgModule({
  declarations: [
    History
  ],
  imports: [
    IonicPageModule.forChild(History)
  ],
  exports: [
    History
  ]
})
export class HistoryModule {}
