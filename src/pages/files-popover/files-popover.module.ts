import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FilesPopoverPage } from './files-popover';

@NgModule({
  declarations: [
    FilesPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(FilesPopoverPage),
  ],
})
export class FilesPopoverPageModule {}
