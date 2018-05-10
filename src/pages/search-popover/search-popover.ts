
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
////import providers
import { AutocompletesProvider } from '../../providers/autocompletes/autocompletes';
import { LocationServicesProvider } from '../../providers/location-services/location-services';
import { MasterdataProvider } from '../../providers/masterdata/masterdata';

import { Subscription } from 'rxjs/Subscription'; //import Subscription เพื่อ unsubscribe() ข้อมูลจาก Server
//import models
import { Servicelocations } from '../../models/servicelocations';
import { Autocompletereturn } from '../../models/autocompletereturn';
import { Step } from '../../models/step';
/**
 * Generated class for the SearchPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-search-popover',
  templateUrl: 'search-popover.html',
})
export class SearchPopoverPage {

  sub: Subscription;
  errorMessage: string;
  sSearch_ReqDate: string = '';
  sSearch_CounterService: string = '';
  sSearch_TrackingNumber: string = '';
  sSearch_Status: string = '';
  lstCounter: Servicelocations[];
  lstStep: Step[];

  cType: string;
  lstTypeItem: Autocompletereturn[];
  lstHeadItem: Autocompletereturn[];
  lstManufItem: Autocompletereturn[];
  lstTypeCheck: boolean[];
  lstHeadCheck: boolean[];
  lstManufCheck: boolean[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public autocompletesProvider: AutocompletesProvider
    , private CounterServiceProv: LocationServicesProvider
    , private MasterDataProv: MasterdataProvider) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SearchPopoverPage');
    this.InitCtrl();
  }

  InitCtrl() {

    this.BindCounterServices();
    this.BindStep();

  }
  BindCounterServices(isScroll?: boolean) {

    this.sub = this.CounterServiceProv.getLocationServices_Master('').subscribe(
      (res) => {
        if (isScroll && this.lstCounter.length > 0)
          this.lstCounter = this.lstCounter.concat(res);
        else
          this.lstCounter = res;

      },
      (error) => { this.errorMessage = <any>error }
    );
  }
  BindStep(isScroll?: boolean) {

    this.sub = this.MasterDataProv.getData_Master('masterdata_status', '', 0, 50).subscribe(
      (res) => {
        if (isScroll && this.lstStep.length > 0)
          this.lstStep = this.lstStep.concat(res);
        else
          this.lstStep = res;
        //console.log(this.lstStep);
      },
      (error) => { this.errorMessage = <any>error }
    );
  }

  clear() {
    this.sSearch_ReqDate = '';
    this.sSearch_CounterService = '';
    this.sSearch_TrackingNumber = '';
    this.sSearch_Status = '';

  }

  dismiss() {
    let sSearch_ReqDate = '';
    let sSearch_CounterService = '';
    let sSearch_TrackingNumber = '';
    let sSearch_Status = '';

    sSearch_ReqDate = this.sSearch_ReqDate;
    sSearch_CounterService = this.sSearch_CounterService;
    sSearch_TrackingNumber = this.sSearch_TrackingNumber;
    sSearch_Status = this.sSearch_Status;
    this.viewCtrl.dismiss([sSearch_ReqDate, sSearch_CounterService, sSearch_TrackingNumber, sSearch_Status]);

  }





}
