//import Component 
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Platform, ModalController, LoadingController } from 'ionic-angular';
// import { Subscription } from 'rxjs/Subscription';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
////import providers 
import { MasterdataProvider } from '../../providers/masterdata/masterdata';
////import models 
import { trans_request } from '../../models/trans_request'

@IonicPage()
@Component({
  selector: 'page-app-data',
  templateUrl: 'app-data.html',
})
export class AppDataPage {
  Master_DATA: Array<Object>;
  isToogle: boolean = false;
  lstDoc: trans_request[];
  sBarCode: string = '';


  constructor(
    public toastCtrl: ToastController,
    public platform: Platform,
    public alertCtrl: AlertController,
    public navCtrl: NavController, private MasterdataProv: MasterdataProvider,
    public navParams: NavParams, private barcodeScanner: BarcodeScanner) {
    this.platform.ready().then(() => {

    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AppDataPage');
  }
  CallScaner() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.sBarCode = barcodeData.text;
      console.log('Barcode data', barcodeData);

    }).catch(err => {
      console.log('Error', err);
    });
  }

  BindDocumentList(isScroll?: boolean) {

  }
  GenList() {


  }
}
