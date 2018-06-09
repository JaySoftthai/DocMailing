//import Component 
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Platform, LoadingController, ModalController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular'
import { Subscription } from 'rxjs/Subscription';
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
import { SignaturePage } from '../../pages/signature/signature';
import { DetailPage } from '../detail/detail';

// @IonicPage()
@Component({
  selector: 'page-app-track-status',
  templateUrl: 'app-track-status.html',
})
export class AppTrackStatusPage {

  Master_DATA: Array<Object>;
  lstInbound: Step[] = [];
  isToogle: boolean = false;
  lstDoc: Step[];
  sBarCode: string = '';
  txtDocCode: string = '';
  SignatureURL: string = '';
  lstRespDocUDP3: Step[];
  sub: Subscription;
  errorMessage: string;
  lstRecvItms: ReceiveItems[];
  ///Ctrl
  ddlStatus: any;
  userdata: UserAccount;
  IsScanner: boolean;
  arr_RoleAcction: string = ',9,10,11,';
  constructor(
    public toastCtrl: ToastController,
    public platform: Platform, private loadingCtrl: LoadingController, private modalCtrl: ModalController,
    public alertCtrl: AlertController, private ActShtCtrl: ActionSheetController,
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
          let _InboundCode = new Step('', 'เอกสารพร้อมส่ง', barcodeData.text, 'assets/images/Drop-Down01.png', 'Y');
          this.lstInbound.push(_InboundCode);

        } else {
          this.presentToast(barcodeData.text + ' ' + ((IsDupplicate) ? ' มีอยู่แล้วในรายการ' : ' สามารถใช้ได้'));
        }
        this.BindDocumentList(barcodeData.cancelled);
      }

    }).catch(err => {
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
        // let barcodeData_text = this.txtDocCode;
        let _InboundCode = new Step('', 'เอกสารพร้อมส่ง', this.txtDocCode, 'assets/images/Drop-Down01.png', 'Y');
        this.lstInbound.push(_InboundCode);
        this.txtDocCode = '';

      } else {
        this.presentToast(this.txtDocCode + ' ' + ((IsDupplicate) ? ' มีอยู่แล้วในรายการ' : ' สามารถใช้ได้'));
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
          text: 'แก้ไข',
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
                  this.navCtrl.push(DetailPage, { nID: lst.inDocID });
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
    let IsValid = (this.ddlStatus != undefined && this.lstInbound.length > 0);

    if (IsValid) {

      let IsCanUpdate = false;
      if (this.ddlStatus == "11") { //ถ้าเป็นการปิดงาน
        let modal = this.modalCtrl.create(SignaturePage, { lst: this.lstInbound, Updater: this.userdata.code });
        modal.onDidDismiss(data => {
          let def_SignatureURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQwAAADICAYAAAAdgt+FAAAFWklEQVR4Xu3UsQ0AMAzDsPb/o12gF+gAZvZEBLrbdhwBAgSCwBWMoGRCgMAXEAyPQIBAFhCMTGVIgIBg+AECBLKAYGQqQwIEBMMPECCQBQQjUxkSICAYfoAAgSwgGJnKkAABwfADBAhkAcHIVIYECAiGHyBAIAsIRqYyJEBAMPwAAQJZQDAylSEBAoLhBwgQyAKCkakMCRAQDD9AgEAWEIxMZUiAgGD4AQIEsoBgZCpDAgQEww8QIJAFBCNTGRIgIBh+gACBLCAYmcqQAAHB8AMECGQBwchUhgQICIYfIEAgCwhGpjIkQEAw/AABAllAMDKVIQECguEHCBDIAoKRqQwJEBAMP0CAQBYQjExlSICAYPgBAgSygGBkKkMCBATDDxAgkAUEI1MZEiAgGH6AAIEsIBiZypAAAcHwAwQIZAHByFSGBAgIhh8gQCALCEamMiRAQDD8AAECWUAwMpUhAQKC4QcIEMgCgpGpDAkQEAw/QIBAFhCMTGVIgIBg+AECBLKAYGQqQwIEBMMPECCQBQQjUxkSICAYfoAAgSwgGJnKkAABwfADBAhkAcHIVIYECAiGHyBAIAsIRqYyJEBAMPwAAQJZQDAylSEBAoLhBwgQyAKCkakMCRAQDD9AgEAWEIxMZUiAgGD4AQIEsoBgZCpDAgQEww8QIJAFBCNTGRIgIBh+gACBLCAYmcqQAAHB8AMECGQBwchUhgQICIYfIEAgCwhGpjIkQEAw/AABAllAMDKVIQECguEHCBDIAoKRqQwJEBAMP0CAQBYQjExlSICAYPgBAgSygGBkKkMCBATDDxAgkAUEI1MZEiAgGH6AAIEsIBiZypAAAcHwAwQIZAHByFSGBAgIhh8gQCALCEamMiRAQDD8AAECWUAwMpUhAQKC4QcIEMgCgpGpDAkQEAw/QIBAFhCMTGVIgIBg+AECBLKAYGQqQwIEBMMPECCQBQQjUxkSICAYfoAAgSwgGJnKkAABwfADBAhkAcHIVIYECAiGHyBAIAsIRqYyJEBAMPwAAQJZQDAylSEBAoLhBwgQyAKCkakMCRAQDD9AgEAWEIxMZUiAgGD4AQIEsoBgZCpDAgQEww8QIJAFBCNTGRIgIBh+gACBLCAYmcqQAAHB8AMECGQBwchUhgQICIYfIEAgCwhGpjIkQEAw/AABAllAMDKVIQECguEHCBDIAoKRqQwJEBAMP0CAQBYQjExlSICAYPgBAgSygGBkKkMCBATDDxAgkAUEI1MZEiAgGH6AAIEsIBiZypAAAcHwAwQIZAHByFSGBAgIhh8gQCALCEamMiRAQDD8AAECWUAwMpUhAQKC4QcIEMgCgpGpDAkQEAw/QIBAFhCMTGVIgIBg+AECBLKAYGQqQwIEBMMPECCQBQQjUxkSICAYfoAAgSwgGJnKkAABwfADBAhkAcHIVIYECAiGHyBAIAsIRqYyJEBAMPwAAQJZQDAylSEBAoLhBwgQyAKCkakMCRAQDD9AgEAWEIxMZUiAgGD4AQIEsoBgZCpDAgQEww8QIJAFBCNTGRIgIBh+gACBLCAYmcqQAAHB8AMECGQBwchUhgQICIYfIEAgCwhGpjIkQEAw/AABAllAMDKVIQECguEHCBDIAoKRqQwJEBAMP0CAQBYQjExlSICAYPgBAgSygGBkKkMCBATDDxAgkAUEI1MZEiAgGH6AAIEsIBiZypAAAcHwAwQIZAHByFSGBAgIhh8gQCALCEamMiRAQDD8AAECWUAwMpUhAQKC4QcIEMgCgpGpDAkQEAw/QIBAFhCMTGVIgIBg+AECBLKAYGQqQwIEBMMPECCQBQQjUxkSIPAANCId1mKSrjoAAAAASUVORK5CYII=";

          this.SignatureURL = (data[0] == undefined || data[0] == null) ? def_SignatureURL : data[0];

          let curr = ''; let next = '';
          if (IsCanUpdate) {
            switch (this.ddlStatus) {
              case "5":
                curr = '3,4';
                next = '5';
                break;
              case "8":
                curr = '3,4,5,6,7';
                next = '8';
                break;
              case "10":
                curr = '4,5,6,7,8,9';
                next = '10';
                break;
              case "11":
                curr = '3,4,5,6,7,8,9,10';
                next = '11';
                break;
              case "15":
                curr = '2';
                next = '15';
                break;

            }
            this.UpdateDocumentStatus(curr, next, this.SignatureURL);
          }
        });
        modal.present();
        IsCanUpdate = true;

      }
      else {
        ///ถ้าเป็นรายการสถานะอื่นๆที่ไม่ใช่ ปิดงาน IsCanUpdateจะเท่ากับ true เสมอ     แต่ถ้าเป็นปิดงาน(11) SignatureURLจะมีค่าทันที
        IsCanUpdate = true;
        this.SignatureURL = '';
        //Other is not close
        let confirm = this.alertCtrl.create({
          title: 'ยืนยันรายการ',
          message: 'ท่านต้องการยืนยันเพื่อดำเนินการปรับสถานะรายการดังกว่าใช่หรือไม่ ?',
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
                let curr = ''; let next = '';
                if (IsCanUpdate) {
                  switch (this.ddlStatus) {
                    case "5":
                      curr = '2,3,4';
                      next = '5';
                      break;
                    case "8":
                      curr = '2,3,4,5,6,7';//curr = '3,4,5,6,7';
                      next = '8';
                      break;
                    case "10":
                      curr = '2,3,4,5,6,7,8,9';//curr = '4,5,6,7,8,9';
                      next = '10';
                      break;
                    case "11":
                      curr = '2,3,4,5,6,7,8,9,10';//curr = '3,4,5,6,7,8,9,10';
                      next = '11';
                      break;

                  }
                  this.UpdateDocumentStatus(curr, next, this.SignatureURL);
                }
              }
            }
          ]
        });
        confirm.present();
      }
    } else {

      let wrnMsg = (this.ddlStatus == undefined) ? "กรุณาระบุสถานะที่ต้องการดำเนินการ" : ((this.lstInbound.length <= 0) ? "กรุณาสแกนรายการที่ต้องการดำเนินการอย่างน้อยหนึ่งรายการ" : "");

      let wrn = this.alertCtrl.create({
        title: 'แจ้งเตือน',
        message: wrnMsg,
        buttons: [
          {
            text: 'ตกลง',
            handler: () => {
              wrn.dismiss();
              return false;
            }
          }
        ]
      });
      wrn.present();

    }
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
  UpdateDocumentStatus(CurrStat: string, ToStat: string, imgSign: string) {
    let loading = this.loadingCtrl.create({ content: 'Loading...' });
    loading.present();//เริ่มแสดง Loading 
    let imgSignature = imgSign;
    // let lstSigneture: Step;
    // lstSigneture.sImg = this.SignatureURL;
    let UserScan = (this.userdata == null) ? '' : this.userdata.code;
    this.MasterdataProv.postDocument_ScanStatus(CurrStat, ToStat, this.lstInbound, imgSignature, UserScan).then(res => {

      this.lstRecvItms = JSON.parse(res["_body"]);
      if (this.lstRecvItms.length > 0) {
        this.lstInbound = this.lstRecvItms[0].itm.filter((w) => w.cActive != 'Y');
      }
      loading.dismiss();
      let sMsg = 'ดำเนินการทำรายการเสร็จเรียบร้อย';
      if (this.lstInbound.filter((w) => w.cActive == 'N').length > 0) {
        sMsg = 'สถานะรายการบางรายการไม่อยู่ในขั้นตอนดังกล่าว';
      }
      this.presentToast(sMsg);
    }).catch(err => {
      this.presentToast(err.message)
      loading.dismiss();

    });
    this.SignatureURL = "";
  }
}