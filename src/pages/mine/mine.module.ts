import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Mine } from './mine';

@NgModule({
  declarations: [
    Mine
  ],
  imports: [
    IonicPageModule.forChild(Mine),
  ],
  exports: [
    Mine
  ]
})
export class MineModule {}
