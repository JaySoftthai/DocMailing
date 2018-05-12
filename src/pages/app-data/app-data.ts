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

    this.barcodeScanner.scan({
      // disableSuccessBeep: false, // iOS and Android
      // preferFrontCamera: true, // iOS and Android
      // showFlipCameraButton: true, // iOS and Android
      // showTorchButton: true, // iOS and Android
      // torchOn: true, // Android, launch with the torch switched on (if available)
      // saveHistory: true, // Android, save scan history (default false)
      // prompt: "Place a barcode inside the scan area", // Android
      // resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      // formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
      // orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
      // disableAnimations: true, // iOS
    }).then(barcodeData => {

      if (barcodeData.cancelled == true) {
        // alert(“Was cancelled”);
        this.presentToast('barcodeData cancelled: true');

      } else {
        this.sBarCode = barcodeData.text;
        let _InboundCode = new Step('', 'เอกสารพร้อมส่ง', this.txtDocCode, '../../assets/images/Drop-Down01.png', 'Y');
        this.lstInbound.push(_InboundCode);
        this.BindDocumentList(false);
      }
    }).catch(err => {
      console.log('Error', err);
      this.presentToast(err);
    });
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

  BindDocumentList(isScroll?: boolean) {
    console.log('BindDocumentList()');
    console.log(this.lstInbound);

    this.CallScaner()
  }
  GenList() {
    let barcodeData_text = this.txtDocCode;
    let _InboundCode = new Step('', 'เอกสารพร้อมส่ง', this.txtDocCode, '../../assets/images/Drop-Down01.png', 'Y');
    this.lstInbound.push(_InboundCode);
  }
}
