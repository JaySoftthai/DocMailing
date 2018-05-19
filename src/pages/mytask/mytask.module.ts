import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MytaskPage } from './mytask';

@NgModule({
  declarations: [
    MytaskPage,
  ],
  imports: [
    IonicPageModule.forChild(MytaskPage),
  ],
})
export class MytaskPageModule {}
