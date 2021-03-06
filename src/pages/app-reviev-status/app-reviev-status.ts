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
  selector: 'page-app-reviev-status',
  templateUrl: 'app-reviev-status.html',
})
export class AppRevievStatusPage {
  lstStatus: Step[];
  // lstStatus = new Step{  "7", "ยืนยันรับงานจาก บก.", "14", "นำเอกสารกลับไปกอง บก.", "15", "ไม่มีเอกสารปลายทาง", "16", "บก.รับงานเอกสาร", "18", "ยืนยันรับงานจาก บก.เพื่อส่งเอกสาร", "19", "ปิดงาน" }
  ScanDataType: string = '1';
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
  OldStatus: any;
  userdata: UserAccount;
  IsScanner: boolean;
  isMessenger: boolean = false;
  isCourier: boolean = false;
  isManager: boolean = false;
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
        this.isMessenger = (this.userdata.role == "11");
        this.isCourier = (this.userdata.role == "10");
        this.isManager = (this.userdata.role == "9");
        this.IsScanner = this.arr_RoleAcction.indexOf(',' + this.userdata.role + ',') > 0;
      } else {
        this.navCtrl.setRoot(LoginPage);
        return false;
      }
      //this.presentToast(this.IsScanner + this.userdata.role + ':' + this.userdata.code + ' ' + this.userdata.fname + ' ' + this.userdata.lname);
    });
  }
  CallScaner() {

    if (this.ddlStatus == null || this.ddlStatus == undefined || this.ddlStatus == "") {
      this.presentToast('ระบุสถานะที่ต้องการดำเนินการ');
    } else {
      this.barcodeScanner.scan({
        preferFrontCamera: false
        , showFlipCameraButton: false
        , showTorchButton: false
        , torchOn: false
        , disableAnimations: false
        , disableSuccessBeep: false
        // , prompt: "Do you want to next?"
        // , orientation: "portrait" 1000
        , resultDisplayDuration: 0
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
            // let _InboundCode = new Step('', 'เอกสารพร้อมรับ', barcodeData.text, 'assets/images/Drop-Down01.png', 'Y');
            // this.lstInbound.push(_InboundCode);

            this.MasterdataProv.checkReqDocumentByDocCode('checkPRMS', barcodeData.text, this.userdata.code).subscribe((res) => {

              // this.presentToast(barcodeData.text + ' ' + this.userdata.code + ' ' + res.length);

              let isCourierRole = (this.userdata.role == "10");
              if (res.length <= 0 && (isCourierRole)) {
                let confirm = this.alertCtrl.create({
                  title: 'แจ้งเตือน',
                  message: 'เอกสาร ' + barcodeData.text + ' ไม่ได้อยู่ในพื้นที่ความรับผิดชอบ ท่านต้องการยืนยันการทำรายการหรือไม่ ?',
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

                        this.MasterdataProv.getReqDocumentByDocCode('request_document_code', barcodeData.text).subscribe(
                          (res) => {
                            let lst: trans_request;
                            if (res.length > 0) {
                              lst = res[0];
                              let IsAllowThisStatus = this.MasterdataProv.IsAllowStatus4Scaner("reciev", this.ddlStatus, lst.nStep);

                              if (IsAllowThisStatus) {
                                let _InboundCode = new Step('', lst.sStepName, barcodeData.text, lst.sStepIcon, 'Y');
                                this.lstInbound.push(_InboundCode);
                                this.txtDocCode = '';
                              } else {
                                this.presentToast('ไม่สามารถดำเนินการเอกสารดังกล่าวในสถานะที่เลือกได้');
                              }
                            }
                          },
                          (error) => {
                            this.errorMessage = <any>error;
                            this.presentToast(this.errorMessage);
                          });
                      }
                    }
                  ]
                });
                confirm.present();
              } else {

                this.MasterdataProv.getReqDocumentByDocCode('request_document_code', barcodeData.text).subscribe(
                  (res) => {
                    let lst: trans_request;
                    if (res.length > 0) {
                      lst = res[0];
                      let IsAllowThisStatus = this.MasterdataProv.IsAllowStatus4Scaner("reciev", this.ddlStatus, lst.nStep);
                      ////console.log('reciev:scan on area')
                      ////console.log(IsAllowThisStatus)
                      ////console.log(this.ddlStatus)
                      ////console.log(lst.nStep)
                      if (IsAllowThisStatus) {
                        let _InboundCode = new Step('', lst.sStepName, barcodeData.text, lst.sStepIcon, 'Y');
                        this.lstInbound.push(_InboundCode);
                        this.txtDocCode = '';
                      } else {
                        this.presentToast('ไม่สามารถดำเนินการเอกสารดังกล่าวในสถานะที่เลือกได้');
                      }
                    }
                  },
                  (error) => {
                    this.errorMessage = <any>error;
                    this.presentToast(this.errorMessage);
                  });
                return false;
              }
            });

          } else {
            this.presentToast(barcodeData.text + ' ' + ((IsDupplicate) ? ' มีอยู่แล้วในรายการ' : ' สามารถใช้ได้'));
          }

          this.BindDocumentList(barcodeData.cancelled);
        }

      }).catch(err => {
        this.presentToast(err);
      });
    }
  }

  BindDocumentList(isCanceled?: boolean) {
    if (!isCanceled) {
      // this.CallScaner();
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

    let SelectStatus = (this.ddlStatus != undefined && this.ddlStatus != "");
    if (this.txtDocCode != "" && SelectStatus) {
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
        // let _InboundCode = new Step('', 'เอกสารพร้อมรับ', this.txtDocCode, 'assets/images/Drop-Down01.png', 'Y');
        // this.lstInbound.push(_InboundCode);
        // this.txtDocCode = '';


        this.MasterdataProv.checkReqDocumentByDocCode('checkPRMS', this.txtDocCode, this.userdata.code).subscribe((res) => {
          if (res.length <= 0) {
            let confirm = this.alertCtrl.create({
              title: 'แจ้งเตือน',
              message: 'เอกสาร ' + this.txtDocCode + ' ไม่ได้อยู่ในพื้นที่ความรับผิดชอบ ท่านต้องการยืนยันการทำรายการหรือไม่ ?',
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


                    this.MasterdataProv.getReqDocumentByDocCode('request_document_code', this.txtDocCode).subscribe(
                      (res) => {
                        let lst: trans_request;
                        if (res.length > 0) {
                          lst = res[0];
                          let IsAllowThisStatus = this.MasterdataProv.IsAllowStatus4Scaner("reciev", this.ddlStatus, lst.nStep);

                          ////console.log('reciev:scan on area')
                          ////console.log(IsAllowThisStatus)
                          ////console.log(this.ddlStatus)
                          ////console.log(lst.nStep)
                          if (IsAllowThisStatus) {
                            let _InboundCode = new Step('', lst.sStepName, this.txtDocCode, lst.sStepIcon, 'Y');
                            this.lstInbound.push(_InboundCode);
                            this.txtDocCode = '';
                          } else {
                            this.presentToast('ไม่สามารถดำเนินการเอกสารดังกล่าวในสถานะที่เลือกได้');
                          }
                        }
                      },
                      (error) => {
                        this.errorMessage = <any>error;
                        this.presentToast(this.errorMessage);
                      });
                  }
                }
              ]
            });
            confirm.present();
          } else {
            this.MasterdataProv.getReqDocumentByDocCode('request_document_code', this.txtDocCode).subscribe(
              (res) => {
                let lst: trans_request;
                if (res.length > 0) {
                  lst = res[0];
                  let IsAllowThisStatus = this.MasterdataProv.IsAllowStatus4Scaner("reciev", this.ddlStatus, lst.nStep);

                  ////console.log('reciev:scan on area')
                  ////console.log(IsAllowThisStatus)
                  ////console.log(this.ddlStatus)
                  ////console.log(lst.nStep)
                  if (IsAllowThisStatus) {
                    let _InboundCode = new Step('', lst.sStepName, this.txtDocCode, lst.sStepIcon, 'Y');
                    this.lstInbound.push(_InboundCode);
                    this.txtDocCode = '';
                  } else {
                    this.presentToast('ไม่สามารถดำเนินการเอกสารดังกล่าวในสถานะที่เลือกได้');
                  }
                }
              },
              (error) => {
                this.errorMessage = <any>error;
                this.presentToast(this.errorMessage);
              });
          }
        });


      } else {
        this.presentToast(this.txtDocCode + ' ' + ((IsDupplicate) ? ' มีอยู่แล้วในรายการ' : ((result_expression) ? '' : ' รูปแบบไม่ถูกต้อง')));
      }
    } else {
      let cond_msg = "";
      cond_msg += (!SelectStatus) ? (cond_msg == "" ? "กรุณา" : "และ") + "ระบุสถานะที่ต้องการดำเนินการ" : "";
      cond_msg += (this.txtDocCode == "") ? (cond_msg == "" ? "กรุณา" : "และ") + "กรอกบาร์โค๊ด" : "";

      this.presentToast(cond_msg);

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
    let IsValid = (this.ddlStatus != undefined && this.lstInbound.length > 0);

    if (IsValid) {

      let IsCanUpdate = false;
      if (this.ddlStatus == "19") { //ถ้าเป็นการปิดงาน
        let modal = this.modalCtrl.create(SignaturePage, { lst: this.lstInbound, Updater: this.userdata.code });
        modal.onDidDismiss(data => {
          let def_SignatureURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQwAAADICAYAAAAdgt+FAAAFWklEQVR4Xu3UsQ0AMAzDsPb/o12gF+gAZvZEBLrbdhwBAgSCwBWMoGRCgMAXEAyPQIBAFhCMTGVIgIBg+AECBLKAYGQqQwIEBMMPECCQBQQjUxkSICAYfoAAgSwgGJnKkAABwfADBAhkAcHIVIYECAiGHyBAIAsIRqYyJEBAMPwAAQJZQDAylSEBAoLhBwgQyAKCkakMCRAQDD9AgEAWEIxMZUiAgGD4AQIEsoBgZCpDAgQEww8QIJAFBCNTGRIgIBh+gACBLCAYmcqQAAHB8AMECGQBwchUhgQICIYfIEAgCwhGpjIkQEAw/AABAllAMDKVIQECguEHCBDIAoKRqQwJEBAMP0CAQBYQjExlSICAYPgBAgSygGBkKkMCBATDDxAgkAUEI1MZEiAgGH6AAIEsIBiZypAAAcHwAwQIZAHByFSGBAgIhh8gQCALCEamMiRAQDD8AAECWUAwMpUhAQKC4QcIEMgCgpGpDAkQEAw/QIBAFhCMTGVIgIBg+AECBLKAYGQqQwIEBMMPECCQBQQjUxkSICAYfoAAgSwgGJnKkAABwfADBAhkAcHIVIYECAiGHyBAIAsIRqYyJEBAMPwAAQJZQDAylSEBAoLhBwgQyAKCkakMCRAQDD9AgEAWEIxMZUiAgGD4AQIEsoBgZCpDAgQEww8QIJAFBCNTGRIgIBh+gACBLCAYmcqQAAHB8AMECGQBwchUhgQICIYfIEAgCwhGpjIkQEAw/AABAllAMDKVIQECguEHCBDIAoKRqQwJEBAMP0CAQBYQjExlSICAYPgBAgSygGBkKkMCBATDDxAgkAUEI1MZEiAgGH6AAIEsIBiZypAAAcHwAwQIZAHByFSGBAgIhh8gQCALCEamMiRAQDD8AAECWUAwMpUhAQKC4QcIEMgCgpGpDAkQEAw/QIBAFhCMTGVIgIBg+AECBLKAYGQqQwIEBMMPECCQBQQjUxkSICAYfoAAgSwgGJnKkAABwfADBAhkAcHIVIYECAiGHyBAIAsIRqYyJEBAMPwAAQJZQDAylSEBAoLhBwgQyAKCkakMCRAQDD9AgEAWEIxMZUiAgGD4AQIEsoBgZCpDAgQEww8QIJAFBCNTGRIgIBh+gACBLCAYmcqQAAHB8AMECGQBwchUhgQICIYfIEAgCwhGpjIkQEAw/AABAllAMDKVIQECguEHCBDIAoKRqQwJEBAMP0CAQBYQjExlSICAYPgBAgSygGBkKkMCBATDDxAgkAUEI1MZEiAgGH6AAIEsIBiZypAAAcHwAwQIZAHByFSGBAgIhh8gQCALCEamMiRAQDD8AAECWUAwMpUhAQKC4QcIEMgCgpGpDAkQEAw/QIBAFhCMTGVIgIBg+AECBLKAYGQqQwIEBMMPECCQBQQjUxkSICAYfoAAgSwgGJnKkAABwfADBAhkAcHIVIYECAiGHyBAIAsIRqYyJEBAMPwAAQJZQDAylSEBAoLhBwgQyAKCkakMCRAQDD9AgEAWEIxMZUiAgGD4AQIEsoBgZCpDAgQEww8QIJAFBCNTGRIgIBh+gACBLCAYmcqQAAHB8AMECGQBwchUhgQICIYfIEAgCwhGpjIkQEAw/AABAllAMDKVIQECguEHCBDIAoKRqQwJEBAMP0CAQBYQjExlSICAYPgBAgSygGBkKkMCBATDDxAgkAUEI1MZEiAgGH6AAIEsIBiZypAAAcHwAwQIZAHByFSGBAgIhh8gQCALCEamMiRAQDD8AAECWUAwMpUhAQKC4QcIEMgCgpGpDAkQEAw/QIBAFhCMTGVIgIBg+AECBLKAYGQqQwIEBMMPECCQBQQjUxkSIPAANCId1mKSrjoAAAAASUVORK5CYII=";

          this.SignatureURL = (data[0] == undefined || data[0] == null) ? def_SignatureURL : data[0];

          let curr = ''; let next = '';
          if (IsCanUpdate) {
            switch (this.ddlStatus) {
              case "3":
                curr = '2,3,4,5,6,7,14,15,16,17,18';//curr = '2,3,4,5,6,7,14,15,16,17,18';
                next = '3';
                break;
              case "4":
                curr = '2,3,4,5,6,7,14,15,16,17,18';//curr = '2,3,4,5,6,7,14,15,16,17,18';
                next = '4';
                break;
              case "5":
                curr = '2,3,4,5,6,7,14,15,16,17,18';//curr = '2,3,4,5,6,7,14,15,16,17,18';
                next = '5';
                break;
              case "7":
                curr = '2,3,4,5,6,7,14,15,16,17,18';//curr = '2,3,4,5,6,7,14,15,16,17,18';
                next = '7';
                break;
              case "14":
                curr = '2,3,4,5,6,7,14,15,16,17,18';//curr = '2,3,4,5,6,7,14,15,16,17,18';
                next = '14';
                break;
              case "15":
                curr = '2,3,4,5,6,7,14,15,16,17,18';//curr = '2,3,4,5,6,7,14,15,16,17,18';
                next = '15';
                break;
              case "16":
                curr = '2,3,4,5,6,7,14,15,16,17,18';//curr = '2,3,4,5,6,7,14,15,16,17,18';
                next = '16';
                break;
              case "18":
                curr = '2,3,4,5,6,7,14,15,16,17,18';//curr = '2,3,4,5,6,7,14,15,16,17,18';
                next = '18';
                break;
              case "19":
                curr = '2,3,4,5,6,7,14,15,16,17,18';//curr = '2,3,4,5,6,7,14,15,16,17,18';
                next = '19';
                break;

            }

            if (data[1]) {//if click cancel from sifnaturepage we will update
              this.UpdateDocumentStatus(curr, next, this.SignatureURL);
            }
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
                let curr = ''; let next = '';
                if (IsCanUpdate) {
                  switch (this.ddlStatus) {
                    case "3":
                      curr = '2,3,4,5,6,7,14,15,16,17,18';//curr = '2,3,4,5,6,7,14,15,16,17,18';
                      next = '3';
                      break;
                    case "4":
                      curr = '2,3,4,5,6,7,14,15,16,17,18';//curr = '2,3,4,5,6,7,14,15,16,17,18';
                      next = '4';
                      break;
                    case "5":
                      curr = '2,3,4,5,6,7,14,15,16,17,18';//curr = '2,3,4,5,6,7,14,15,16,17,18';
                      next = '5';
                      break;
                    case "7":
                      curr = '2,3,4,5,6,7,14,15,16,17,18';//curr = '2,3,4,5,6,7,14,15,16,17,18';
                      next = '7';
                    case "14":
                      curr = '2,3,4,5,6,7,14,15,16,17,18';//curr = '2,3,4,5,6,7,14,15,16,17,18';
                      next = '14';
                      break;
                    case "15":
                      curr = '2,3,4,5,6,7,14,15,16,17,18';//curr = '2,3,4,5,6,7,14,15,16,17,18';
                      next = '15';
                      break;
                    case "16":
                      curr = '2,3,4,5,6,7,14,15,16,17,18';//curr = '2,3,4,5,6,7,14,15,16,17,18';
                      next = '16';
                      break;
                    case "18":
                      curr = '2,3,4,5,6,7,14,15,16,17,18';//curr = '2,3,4,5,6,7,14,15,16,17,18';
                      next = '18';
                      break;
                    case "19":
                      curr = '2,3,4,5,6,7,14,15,16,17,18';//curr = '2,3,4,5,6,7,14,15,16,17,18';
                      next = '19';
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
    ToStat = this.ddlStatus;
    let UserScan = (this.userdata == null) ? '' : this.userdata.code;
    this.MasterdataProv.postDocument_ScanStatus(this.ScanDataType, CurrStat, ToStat, this.lstInbound, imgSignature, UserScan).then(res => {

      this.lstRecvItms = JSON.parse(res["_body"]);
      let sMsg = 'ดำเนินการทำรายการเสร็จเรียบร้อย.';
      if (this.lstRecvItms.length > 0) {
        this.lstInbound = this.lstRecvItms[0].itm.filter((w) => w.cActive != 'Y');
      } else {
        sMsg = 'no response from server.';
      }
      loading.dismiss();
      if (this.lstInbound.filter((w) => w.cActive == 'N').length > 0) {
        sMsg = 'ไม่สามารถดำเนินการได้ กรุณาตรวจสอบความถูกต้องของข้อมูล';//สถานะรายการบางรายการไม่อยู่ในขั้นตอนดังกล่าว
      }
      this.presentToast(sMsg);
    }).catch(err => {
      this.presentToast(err.message)
      loading.dismiss();

    });
    this.SignatureURL = "";
  }

  onStatusCancel(onevent) {
    return false;
  }
  onStatusClick(event) {
    this.OldStatus = this.ddlStatus;
  }
  onStatusChange(onevent, oldVal) {

    if (this.lstInbound.length > 0 && this.ddlStatus != this.OldStatus) {
      let confirm = this.alertCtrl.create({
        title: 'แจ้งเตือน',
        message: 'หากท่านต้องการเปลี่ยนสถานะการแสกนรายการเอกสารที่เคยดำเนินการไว้ รายการจะถูกยกเลิก<br><br>ท่านต้องการยกเลิกรายการใช่หรือไม่ ?',
        buttons: [
          {
            text: 'ไม่ยืนยัน',
            handler: () => {
              confirm.dismiss();
              this.ddlStatus = this.OldStatus;
              return false;

            }
          },
          {
            text: 'ยืนยัน',
            handler: () => {
              console.log(this.lstInbound)
              this.OldStatus = onevent;

              this.lstInbound = [];
              console.log(this.lstInbound)
            }
          }
        ]
      });
      confirm.present();
    }
  }
}
