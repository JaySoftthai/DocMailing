import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription'; //import Subscription เพื่อ unsubscribe() ข้อมูลจาก Server 
///Import Provider 
import { MasterdataProvider } from '../../providers/masterdata/masterdata';
import { ApiProvider } from '../../providers/api/api';
import { UseraccountProvider } from '../../providers/useraccount/useraccount';
////import models
import { files_request } from '../../models/files_request';
import { UserAccount } from '../../models/useraccount';


// @IonicPage()
@Component({
  selector: 'page-files-popover',
  templateUrl: 'files-popover.html',
})
export class FilesPopoverPage {
  userdata: UserAccount;
  IsScanner: boolean;
  arr_RoleAcction: string = ',9,10,11,';
  webURL: string = this.ApiProv.getWebUrl();
  sub: Subscription;
  errorMessage: string;
  DocID: string;
  filesObj: files_request[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private userProv: UseraccountProvider
    , public FilesProv: MasterdataProvider, public ApiProv: ApiProvider, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {

    this.userProv.getUserAccount().then((value: UserAccount) => {
      this.userdata = value;
      if (value != undefined && value.code != null) { }

      let loader = this.loadingCtrl.create({ content: "Loading..." });
      loader.present();
      this.BindFiles();
      loader.dismiss();
    });
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
