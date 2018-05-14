//import Component 
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Platform, ModalController, LoadingController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular'
// import { Subscription } from 'rxjs/Subscription';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
////import providers 
import { MasterdataProvider } from '../../providers/masterdata/masterdata';
////import models 
import { trans_request } from '../../models/trans_request';
import { Step } from '../../models/step';


@IonicPage()
@Component({
  selector: 'page-app-outbound',
  templateUrl: 'app-outbound.html',
})
export class AppOutboundPage {

  Master_DATA: Array<Object>;
  lstInbound: Step[] = [];
  isToogle: boolean = false;
  lstDoc: Step[];
  sBarCode: string = '';
  txtDocCode: string = '';

  constructor(
    public toastCtrl: ToastController,
    public platform: Platform,
    public alertCtrl: AlertController, private ActShtCtrl: ActionSheetController,
    public navCtrl: NavController, private MasterdataProv: MasterdataProvider,
    public navParams: NavParams, private barcodeScanner: BarcodeScanner) {
    this.platform.ready().then(() => {

    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AppDataPage');
  }
  CallScaner() {

    this.barcodeScanner.scan({
      preferFrontCamera: false
      , showFlipCameraButton: false
      , showTorchButton: false
      , torchOn: false
      , disableAnimations: false
      , disableSuccessBeep: false
      // , prompt: "Do you want to next?"
      // , orientation: "portrait"
      , resultDisplayDuration: 1000
    }).then(barcodeData => {

      this.sBarCode = barcodeData.text;
      if (barcodeData.text != "") {

        //check dupplicate
        let IsDupplicate = false;
        if (barcodeData.text != "" && this.lstInbound.length > 0) {
          let aray_inbnd = this.lstInbound.filter(f => {
            return (f.sDetail.toLowerCase() == barcodeData.text.toLowerCase());
          });
          IsDupplicate = aray_inbnd.length > 0;
        }


        if (!IsDupplicate) {
          let _InboundCode = new Step('', 'เอกสารพร้อมส่ง', barcodeData.text, '../../assets/images/Drop-Down01.png', 'Y');
          this.lstInbound.push(_InboundCode);

        } else {
          this.presentToast(barcodeData.text + ' ' + ((IsDupplicate) ? ' is dupplicate.' : ' can use.'));
        }
        this.BindDocumentList(barcodeData.cancelled);
      }

    }).catch(err => {
      //console.log('Error', err);
      this.presentToast(err);
    });
  }

  BindDocumentList(isCanceled?: boolean) {
    if (!isCanceled) {
      this.CallScaner();
    }
  }
  presentToast(err) {
    let toast = this.toastCtrl.create({
      message: err,
      duration: 3000,
      position: 'buttom'
    });

    toast.onDidDismiss(() => {
      //console.log('Dismissed toast');
    });

    toast.present();
  }

  GenList() {
    if (this.txtDocCode != "") {
      //check dupplicate
      let IsDupplicate = false;
      if (this.txtDocCode != "" && this.lstInbound.length > 0) {
        let aray_inbnd = this.lstInbound.filter(f => {
          return (f.sDetail.toLowerCase() == this.txtDocCode.toLowerCase());
        });
        IsDupplicate = aray_inbnd.length > 0;
      }

      if (!IsDupplicate) {
        let barcodeData_text = this.txtDocCode;
        let _InboundCode = new Step('', 'เอกสารพร้อมส่ง', this.txtDocCode, '../../assets/images/Drop-Down01.png', 'Y');
        this.lstInbound.push(_InboundCode);
        this.txtDocCode = '';

      } else {
        this.presentToast(this.txtDocCode + ' ' + ((IsDupplicate) ? ' is dupplicate.' : ' can use.'));
      }
    } else {
      this.presentToast('Barcode is required!');

    }
  }
  ShowActnCtrl(nDocID, sDocCode) {


  }

  presentActionSheet(nDocID, sDocCode) {
    let actionSheet = this.ActShtCtrl.create({
      title: 'Choose Event',
      buttons: [
        {
          text: 'Edit',
          icon: 'create',
          cssClass: 'action-sheet-center',
          handler: () => {
            //console.log('edit clicked');
          }
        },
        {
          text: 'Delete',
          icon: 'trash',
          cssClass: 'action-sheet-center',
          handler: () => {
            this.lstInbound.filter(f => { f.sDetail == sDocCode });
            let aray_inbnd = this.lstInbound.filter(f => {
              return f.sDetail.toLowerCase().indexOf(sDocCode.toLowerCase()) > -1;
            });
            let inbnd = aray_inbnd[0];
            let idx_remv = this.lstInbound.indexOf(inbnd);
            this.lstInbound.splice(idx_remv, 1);

          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close-circle',
          cssClass: 'action-sheet-center',
          handler: () => {
            let navTransition = actionSheet.dismiss();
            return false;
          }
        }
      ]
    });
    actionSheet.present();
  }
  ConfirmInbound() {
    let confirm = this.alertCtrl.create({
      title: 'Do you want to confirm?',
      message: 'Do you agree to confirm Recieve post/document and update to next status ?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            confirm.dismiss();
            return false;
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.UpdateDocumentStatus();
          }
        }
      ]
    });
    confirm.present();
  }
  CheckDupplicate(sDocCode): Promise<boolean> {
    return new Promise(resolve => {
      var IsDupplicate = false;
      if (sDocCode != "" && this.lstInbound.length > 0) {
        let aray_inbnd = this.lstInbound.filter(f => {
          IsDupplicate = (f.sDetail.toLowerCase().indexOf(sDocCode.toLowerCase()) > -1);
        });
      } else { IsDupplicate = false; }
      resolve(IsDupplicate);
    });
  }
  romoveDupplicate(sDocCode) {
    if (sDocCode != "" && this.lstInbound.length > 0) {
      let aray_inbnd = this.lstInbound.filter(f => {
        return f.sDetail.toLowerCase().indexOf(sDocCode.toLowerCase()) > -1;
      });

      if (aray_inbnd.length > 0) {
        let inbnd = aray_inbnd[0];
        let idx_remv = this.lstInbound.indexOf(inbnd);
        this.lstInbound.splice(idx_remv, 1);
      }
    }
  }
  CancelInbound() {

    let confirm = this.alertCtrl.create({
      title: 'Do you want to clear transaction?',
      message: 'Do you agree to clear transaction post/document?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            confirm.dismiss();
            return false;
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.lstInbound = [];
          }
        }
      ]
    });
    confirm.present();
  }
  delScan(nDocID) {

  }

  viewdetail(nDocID) {
    // this.navCtrl.push(DetailPage, { nID: nID });

  }
  UpdateDocumentStatus() {
    console.log(this.lstInbound);

  }
}

