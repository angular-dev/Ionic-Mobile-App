import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyFavorite } from './my-favorite';

@NgModule({
  declarations: [
    MyFavorite
  ],
  imports: [
    IonicPageModule.forChild(MyFavorite)
  ],
  exports: [
    MyFavorite
  ]
})
export class MyFavoriteModule {}
