import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AfterPlan } from './after-plan';

@NgModule({
  declarations: [
    AfterPlan
  ],
  imports: [
    IonicPageModule.forChild(AfterPlan),
  ],
  exports: [
    AfterPlan
  ]
})
export class AfterPlanModule {}
