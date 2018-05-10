import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription'; //import Subscription เพื่อ unsubscribe() ข้อมูลจาก Server 
///Import Provider 
import { MasterdataProvider } from '../../providers/masterdata/masterdata';
import { ApiProvider } from '../../providers/api/api';
////import models
import { files_request } from '../../models/files_request';


@IonicPage()
@Component({
  selector: 'page-files-popover',
  templateUrl: 'files-popover.html',
})
export class FilesPopoverPage {
  webURL: string = this.ApiProv.getWebUrl();
  sub: Subscription;
  errorMessage: string;
  DocID: string;
  filesObj: files_request[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController
    , public FilesProv: MasterdataProvider, public ApiProv: ApiProvider) {
  }

  ionViewDidLoad() {
    this.BindFiles();
  }
  BindFiles() {
    this.DocID = this.navParams.get('nDocID');
    this.sub = this.FilesProv.getFilesDocument('request_files', this.DocID).subscribe(
      (res) => {
        this.filesObj = res;
      },
      (error) => { this.errorMessage = <any>error }
    );
  }
  openFileFromWebServer(sPath, sMIMType) {

    console.log('openFileFromWebServer FilesPopoverPage-->' + sPath + '$' + sMIMType);
  }
  clear() {
    this.viewCtrl.dismiss();
  }
}
