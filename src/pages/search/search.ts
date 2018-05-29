//import Component 
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, ModalController, LoadingController } from 'ionic-angular';
// import { AlertInputOptions } from 'ionic-angular/components/alert/alert-options';

import { Subscription } from 'rxjs/Subscription'; //import Subscription เพื่อ unsubscribe() ข้อมูลจาก Server
////import providers
import { LocationServicesProvider } from '../../providers/location-services/location-services';
import { MasterdataProvider } from '../../providers/masterdata/masterdata';
import { UseraccountProvider } from '../../providers/useraccount/useraccount';
////import models
import { Servicelocations } from '../../models/servicelocations';
import { trans_request } from '../../models/trans_request';
import { EmployeeInfo } from '../../models/EmployeeInfo';
import { SearchPopoverPage } from '../search-popover/search-popover';
import { UserAccount } from '../../models/useraccount';
////import Page
import { DetailPage } from '../detail/detail';
import { LoginPage } from '../../pages/login/login';

// @IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  //Declare param
  nTotalRows: number = 0;//amout all row in db
  nStart: number = 0;//amout Start row display
  nTop: number = 15;//amout Start row display
  itemObj: EmployeeInfo;
  sCompanyName: string = '';
  sUserID: string = '';
  sKeyword: string = '';
  sSearch_ReqDate: string = '';
  sSearch_CounterService: string = '';
  sSearch_TrackingNumber: string = '';
  sSearch_Status: string = '';
  usrdata: UserAccount;

  lstService: Servicelocations[];
  lstDoc: trans_request[];
  sub: Subscription;
  isHasService: boolean;
  isNoData: boolean;
  errorMessage: string;
  //constructor
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
    , private CounterServiceProv: LocationServicesProvider
    , private MasterdataProv: MasterdataProvider
    , private userProv: UseraccountProvider
  ) { }
  ///Method
  ionViewDidLoad() {


    this.userProv.getUserAccount().then((value: UserAccount) => {
      this.usrdata = value;
      if (value != undefined && value.code != null) {

        let loader = this.loadingCtrl.create({ content: "Loading..." });
        loader.present();
        this.getLocationServices(); // เรียกใช้ method getLocationServices()
        this.BindDocumentList();
        loader.dismiss();
      } else {
        this.navCtrl.setRoot(LoginPage);
        return false;
      }
    });
  }

  ionViewWillLeave() {
    // console.log(this.sub)
    if (this.sub != undefined) {
      this.sub.unsubscribe(); // unsubscribe ข้อมูลที่มาจาก server
    }
  }

  getRequestDocument(isScroll?: boolean) {

    this.sub = this.CounterServiceProv.getLocationServices_Master(this.sKeyword).subscribe(
      (res) => {
        if (isScroll && this.lstService.length > 0)
          this.lstService = this.lstService.concat(res);
        else
          this.lstService = res;

        // this.lstSelf = this.Sources.filter(w => w.cSelfCustomer == 'Y');
        // this.lstOther = this.Sources.filter(w => w.cSelfCustomer == 'N');
        this.nTotalRows = this.lstService.length;
        this.isHasService = this.nTotalRows > 0;
        this.isNoData = this.nTotalRows == 0;
      },
      (error) => { this.errorMessage = <any>error }
    );

  }
  getLocationServices(isScroll?: boolean) {

    this.sub = this.CounterServiceProv.getLocationServices_Master(this.sKeyword).subscribe(
      (res) => {
        //console.log('getLocationServices_Master=>subscribe:sKeyword:' + this.sKeyword);
        if (isScroll && this.lstService.length > 0)
          this.lstService = this.lstService.concat(res);
        else
          this.lstService = res;

        // this.lstSelf = this.Sources.filter(w => w.cSelfCustomer == 'Y');
        // this.lstOther = this.Sources.filter(w => w.cSelfCustomer == 'N');
        this.nTotalRows = this.lstService.length;
        this.isHasService = this.nTotalRows > 0;
      },
      (error) => { this.errorMessage = <any>error }
    );
  }

  BindDocumentList(isScroll?: boolean) {
    ///
    let _UserID = (this.usrdata == null) ? '' : this.usrdata.userid;
    let _RoleID = (this.usrdata == null) ? '' : this.usrdata.role;
    this.sub = this.MasterdataProv.getDocument_Trans('request_list', this.sKeyword, [this.sSearch_ReqDate, this.sSearch_CounterService, this.sSearch_TrackingNumber, this.sSearch_Status, _UserID], this.nStart, this.nTop).subscribe(
      (res) => {
        if (isScroll && this.lstDoc.length > 0)
          this.lstDoc = this.lstDoc.concat(res);
        else
          this.lstDoc = res;

        // this.lstSelf = this.Sources.filter(w => w.cSelfCustomer == 'Y');
        // this.lstOther = this.Sources.filter(w => w.cSelfCustomer == 'N');
        //console.log(this.lstDoc);
        this.nStart = this.lstDoc.length;
        this.nTotalRows = this.lstDoc.length;
        this.isHasService = this.nTotalRows > 0;
        this.isNoData = this.nTotalRows == 0;
      },
      (error) => { this.errorMessage = <any>error }
    );
  }

  doRefresh(refresher) {

    this.nStart = 0;

    return new Promise((resolve) => {

      setTimeout(() => {
        this.BindDocumentList(false);
        refresher.complete();
        resolve();
      }, 500);
    });
  }


  doInfinite(infiniteScroll) {

    this.nStart = this.nStart + this.nTop;

    return new Promise((resolve) => {

      setTimeout(() => {
        this.BindDocumentList(true);
        resolve();
      }, 500);
    });
  }



  viewdetail(nID) {
    this.navCtrl.push(DetailPage, { nID: nID });
    // this.navCtrl.push(CustomerDetailPage, { nID: nID });
    //console.log('viewdetail to ConfirmPopup');
  }


  //Response COntrol

  alertConfirm(title, message, handler_OK, text_OK?, handler_Cancel?, text_Cancel?) {

    if (handler_Cancel == undefined) handler_Cancel = () => { };

    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: text_Cancel == undefined ? 'No' : text_Cancel,
          role: 'cancel',
          handler: handler_Cancel
        },
        {
          text: text_OK == undefined ? 'Yes' : text_OK,
          handler: handler_OK
        }
      ]
    });
    alert.present();
  }

  alertToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 100
    });
    toast.present();
  }




  filterCust(myEvent) {

    this.nStart = 0;

    let modal = this.modalCtrl.create(SearchPopoverPage, { sSearch_ReqDate: this.sSearch_ReqDate, sSearch_CounterService: this.sSearch_CounterService, sSearch_TrackingNumber: this.sSearch_TrackingNumber, sSearch_Status: this.sSearch_Status });
    modal.onDidDismiss(data => {
      this.sSearch_ReqDate = data[0];
      this.sSearch_CounterService = data[1];
      this.sSearch_TrackingNumber = data[2];
      this.sSearch_Status = data[3];

      //console.log("filterCust=>modal.onDidDismiss");
      //console.log(data);
      this.BindDocumentList(false);
    });
    modal.present();
  }

  //event searchbar
  getItems(ev: any) {
    // set val to th value of the searchbar
    let val = ev.target.value;

    this.nStart = 0;
    this.sKeyword = '';

    // if the value is an empty string don't filter th items
    if (val && val.trim() != '') {
      this.sKeyword = val;
    }

    this.BindDocumentList();//ถ้าช่องค้นหาว่างให้โหลดข้อมูลทั้งหมดอีกครั้ง
  }
}
