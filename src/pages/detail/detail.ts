import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, LoadingController } from 'ionic-angular';

import { Subscription } from 'rxjs/Subscription'; //import Subscription เพื่อ unsubscribe() ข้อมูลจาก Server 
///Import Provider 
import { MasterdataProvider } from '../../providers/masterdata/masterdata';
import { UseraccountProvider } from '../../providers/useraccount/useraccount';
////import models
import { trans_request } from '../../models/trans_request';
import { UserAccount } from '../../models/useraccount';
///Pages
import { FilesPopoverPage } from '../files-popover/files-popover';

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  userdata: UserAccount;
  IsScanner: boolean;
  arr_RoleAcction: string = ',9,10,11,';
  sub: Subscription;
  errorMessage: string;
  DocID: string;
  itemObj: trans_request[];
  DocObj: trans_request = new trans_request(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);

  constructor(public navCtrl: NavController, public navParams: NavParams, public AlertCtrl: AlertController,
    private modalCtrl: ModalController, private userProv: UseraccountProvider, private loadingCtrl: LoadingController
    , private MasterdataProv: MasterdataProvider) {
  }

  ionViewDidLoad() {

    this.userProv.getUserAccount().then((value: UserAccount) => {
      this.userdata = value;
      if (value != undefined && value.code != null) { }

      let loader = this.loadingCtrl.create({ content: "Loading..." });
      loader.present();
      this.BindDocRequest();
      loader.dismiss();
    });
  }
  BindDocRequest() {
    this.DocID = this.navParams.get('nID');

    this.sub = this.MasterdataProv.getReqDocument('request_document', this.DocID).subscribe(
      (res) => {
        this.itemObj = res;
        this.DocObj = this.itemObj[0];
        console.log(this.itemObj);

      },
      (error) => { this.errorMessage = <any>error }
    );
  }
  viewremark(sTitle, sMgs) {

    let alert = this.AlertCtrl.create({
      title: sTitle != '' ? sTitle : 'หมายเหตุ',
      subTitle: sMgs,
      buttons: ['Close']
    });
    alert.present();

  }

  viewAttachFiles(nDocID) {

    let modal = this.modalCtrl.create(FilesPopoverPage, { nDocID: this.DocID });
    modal.onDidDismiss(data => {

      //console.log("filterCust=>modal.onDidDismiss");
      //console.log(data);

    });
    modal.present();

  }
}
