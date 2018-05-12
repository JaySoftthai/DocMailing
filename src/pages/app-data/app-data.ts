//import Component 
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Platform, ModalController, LoadingController } from 'ionic-angular';
// import { Subscription } from 'rxjs/Subscription';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
////import providers 
import { MasterdataProvider } from '../../providers/masterdata/masterdata';
////import models 
import { trans_request } from '../../models/trans_request';
import { Step } from '../../models/step';

@IonicPage()
@Component({
  selector: 'page-app-data',
  templateUrl: 'app-data.html',
})
export class AppDataPage {
  Master_DATA: Array<Object>;
  lstInbound: Step[] = [];
  isToogle: boolean = false;
  lstDoc: Step[];
  sBarCode: string = '';
  txtDocCode: string = '';

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
      let _InboundCode = new Step('', 'เอกสารพร้อมส่ง', this.txtDocCode, '../../assets/images/Drop-Down01.png', 'Y');
      this.lstInbound.push(_InboundCode);

      this.presentToast('lstInbound: ' + this.lstInbound.length);
      if (barcodeData.cancelled == true) {
        this.presentToast('barcodeData if is cancelled: ' + barcodeData.cancelled);

      } else {
        this.presentToast('barcodeData else is cancelled: ' + barcodeData.cancelled);

      }


      this.BindDocumentList(false);
    }).catch(err => {
      console.log('Error', err);
      this.presentToast(err);
    });
  }

  BindDocumentList(isScroll?: boolean) {
    console.log('BindDocumentList()');
    console.log(this.lstInbound);

    this.CallScaner()
  }
  presentToast(err) {
    let toast = this.toastCtrl.create({
      message: err,
      duration: 3000,
      position: 'buttom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  GenList() {
    let barcodeData_text = this.txtDocCode;
    let _InboundCode = new Step('', 'เอกสารพร้อมส่ง', this.txtDocCode, '../../assets/images/Drop-Down01.png', 'Y');
    this.lstInbound.push(_InboundCode);
  }
}
