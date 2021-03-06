//import Component 
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular'
// import { Subscription } from 'rxjs/Subscription';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
////import providers 
import { MasterdataProvider } from '../../providers/masterdata/masterdata';
import { UseraccountProvider } from '../../providers/useraccount/useraccount';
////import models 
// import { trans_request } from '../../models/trans_request';
import { Step } from '../../models/step';
import { ReceiveItems } from '../../models/receiveItems';
import { UserAccount } from '../../models/useraccount';
import { trans_request } from '../../models/trans_request';
///Pages
import { LoginPage } from '../../pages/login/login';
import { DetailPage } from '../detail/detail';


// @IonicPage()
@Component({
  selector: 'page-app-data',
  templateUrl: 'app-data.html',
})
export class AppDataPage {

  ScanDataType: string = '0';
  Master_DATA: Array<Object>;
  lstInbound: Step[] = [];
  isToogle: boolean = false;
  lstDoc: Step[];
  errorMessage: string = '';
  sBarCode: string = '';
  txtDocCode: string = '';
  lstRecvItms: ReceiveItems[];
  userdata: UserAccount;
  IsScanner: boolean;
  arr_RoleAcction: string = ',9,10,11,';
  constructor(
    public toastCtrl: ToastController,
    public platform: Platform,
    public alertCtrl: AlertController, private ActShtCtrl: ActionSheetController, private loadingCtrl: LoadingController,
    public navCtrl: NavController, private MasterdataProv: MasterdataProvider, private userProv: UseraccountProvider,
    public navParams: NavParams, private barcodeScanner: BarcodeScanner) {
    this.platform.ready().then(() => {

    });
  }


  ionViewDidLoad() {
    this.userProv.getUserAccount().then((value: UserAccount) => {
      this.userdata = value;
      if (value != undefined && value.code != null) {
        this.IsScanner = this.arr_RoleAcction.indexOf(',' + this.userdata.role + ',') > 0;
      } else {
        this.navCtrl.setRoot(LoginPage);
        return false;
      }
      //this.presentToast(this.IsScanner + this.userdata.role + ':' + this.userdata.code + ' ' + this.userdata.fname + ' ' + this.userdata.lname);
    });
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

          let _InboundCode = new Step('', 'เอกสารรอรับ', barcodeData.text, 'assets/images/Drop-Down03.png', 'Y');
          this.lstInbound.push(_InboundCode);

        } else {
          this.presentToast(barcodeData.text + ' ' + ((IsDupplicate) ? ' มีอยู่แล้วในรายการ' : ' สามารถใช้ได้'));
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
      //check expression
      let re = /^([0-9]{1,4}\-[0-9]{1,2}\-[0-9]{1,5})$/;
      let result_expression = re.test(this.txtDocCode);

      //check dupplicate
      let IsDupplicate = false;
      if (this.txtDocCode != "" && this.lstInbound.length > 0) {
        let aray_inbnd = this.lstInbound.filter(f => {
          return (f.sDetail.toLowerCase() == this.txtDocCode.toLowerCase());
        });
        IsDupplicate = aray_inbnd.length > 0;
      }

      if (!IsDupplicate && result_expression) {
        // let barcodeData_text = this.txtDocCode;
        let _InboundCode = new Step('', 'เอกสารรอรับ', this.txtDocCode, 'assets/images/Drop-Down03.png', 'Y');
        this.lstInbound.push(_InboundCode);
        this.txtDocCode = '';

      } else {

        this.presentToast(this.txtDocCode + ' ' + ((IsDupplicate) ? ' มีอยู่แล้วในรายการ' : ((result_expression) ? '' : ' รูปแบบไม่ถูกต้อง')));
      }
    } else {
      this.presentToast('กรุณากรอกบาร์โค๊ด');

    }
  }
  ShowActnCtrl(nDocID, sDocCode) {


  }

  presentActionSheet(nDocID, sDocCode) {
    let actionSheet = this.ActShtCtrl.create({
      title: 'เลือกการดำเนินการ',
      buttons: [
        {
          text: 'ดูรายละเอียด',
          icon: 'create',
          cssClass: 'action-sheet-center',
          handler: () => {
            this.MasterdataProv.getReqDocumentByDocCode('request_document_code', sDocCode).subscribe(
              (res) => {
                let lst: trans_request;
                if (res.length > 0) {
                  lst = res[0];
                  let loader = this.loadingCtrl.create({ content: "Loading..." });
                  loader.present();
                  this.navCtrl.push(DetailPage, { nID: lst.nDocID });
                  loader.dismiss();
                } else {
                  this.presentToast('ไม่พบรายการ :' + sDocCode);
                }
              },
              (error) => {
                this.errorMessage = <any>error;
                this.presentToast(this.errorMessage);
              }
            );
          }
        },
        {
          text: 'ลบ',
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
          text: 'ยกเลิก',
          role: 'cancel',
          icon: 'close-circle',
          cssClass: 'action-sheet-center',
          handler: () => {
            // let navTransition =
            actionSheet.dismiss();
            return false;
          }
        }
      ]
    });
    actionSheet.present();
  }
  ConfirmInbound() {
    let confirm = this.alertCtrl.create({
      title: 'ยืนยันรายการ?',
      message: 'ท่านต้องการยืนยันเพื่อดำเนินการปรับสถานะรายการดังกล่าวใช่หรือไม่ ?',
      buttons: [
        {
          text: 'ไม่ยืนยัน',
          handler: () => {
            confirm.dismiss();
            return false;
          }
        },
        {
          text: 'ยืนยัน',
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
        // let aray_inbnd =
        this.lstInbound.filter(f => {
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
      title: 'ยืนยันการดำเนินการ',
      message: 'ท่านต้องการยืนยันการยกเลิกการทำรายการทั้งหมดใช่หรือไม่?',
      buttons: [
        {
          text: 'ไม่ยืนยัน',
          handler: () => {
            confirm.dismiss();
            return false;
          }
        },
        {
          text: 'ยืนยัน',
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
    let loading = this.loadingCtrl.create({ content: 'Loading...' });
    loading.present();//เริ่มแสดง Loading 
    let imgSignature = '';
    let UserScan = (this.userdata == null) ? '' : this.userdata.code;
    // let lst =
    this.MasterdataProv.postDocument_ScanStat_3('transaction_status', this.lstInbound, imgSignature, UserScan).then(res => {
      // let jsnResp = JSON.parse(res["_body"]);
      this.lstRecvItms = JSON.parse(res["_body"]);
      let sMsg = 'ดำเนินการทำรายการเสร็จเรียบร้อย';
      if (this.lstRecvItms.length > 0) {
        this.lstInbound = this.lstRecvItms[0].itm.filter((w) => w.cActive != 'Y');
      } else {
        sMsg = 'no response from server.';
      }
      // console.log(this.lstInbound);
      loading.dismiss();
      if (this.lstInbound.filter((w) => w.cActive == 'N').length > 0) {
        sMsg = 'สถานะรายการบางรายการไม่อยู่ในขั้นตอนดังกล่าว';
      }
      this.presentToast(sMsg);
    }).catch(err => {
      this.presentToast(err.message)
      loading.dismiss();

    });

  }
}
