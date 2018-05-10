import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Subscription } from 'rxjs/Subscription'; //import Subscription เพื่อ unsubscribe() ข้อมูลจาก Server 
///Import Provider 
import { MasterdataProvider } from '../../providers/masterdata/masterdata';
////import models
import { trans_request } from '../../models/trans_request';


import { FilesPopoverPage } from '../files-popover/files-popover';

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  sub: Subscription;
  errorMessage: string;
  DocID: string;
  itemObj: trans_request[];
  DocObj: trans_request = new trans_request(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);

  constructor(public navCtrl: NavController, public navParams: NavParams, public AlertCtrl: AlertController,
    private pltfrm: Platform, private modalCtrl: ModalController
    , private MasterdataProv: MasterdataProvider) {
  }

  ionViewDidLoad() {
    this.BindDocRequest();
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
