import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPopoverPage } from './search-popover';

@NgModule({
  declarations: [
    SearchPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPopoverPage),
  ],
})
export class SearchPopoverPageModule {}
