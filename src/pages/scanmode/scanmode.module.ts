import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScanmodePage } from './scanmode';

@NgModule({
  declarations: [
    ScanmodePage,
  ],
  imports: [
    IonicPageModule.forChild(ScanmodePage),
  ],
})
export class ScanmodePageModule {}
