import { NgModule } from '@angular/core';
import { IonicPageModule, Tabs } from 'ionic-angular';
import { MainTabsPage } from './main-tabs-page';

@NgModule({
  declarations: [
    MainTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(MainTabsPage),
  ],
  providers: [
    Tabs
  ]
})
export class MainTabsPageModule {}
