import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription'; //import Subscription เพื่อ unsubscribe() ข้อมูลจาก Server
///providers 
import { UseraccountProvider } from '../../providers/useraccount/useraccount';
import { trans_request } from '../../models/trans_request';
import { MasterdataProvider } from '../../providers/masterdata/masterdata';
///models
import { UserAccount } from '../../models/useraccount';
///Pages 
// import { MytaskPage } from '../mytask/mytask';
// import { SearchPage } from '../search/search';
// import { ScanmodePage } from '../scanmode/scanmode';
// import { MyprofilePage } from '../myprofile/myprofile';
import { DetailPage } from '../detail/detail';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  errorMessage: string;
  sub: Subscription;
  usrdata: UserAccount;
  logined: boolean;
  name: string;
  position: string;
  organization: string;
  photo: string;
  versionNumber: string = '';

  nTotalRows: number = 0;//amout all row in db
  nStart: number = 0;//amout Start row display
  nTop: number = 15;//amout Start row display
  lstDoc: trans_request[];
  isHasService: boolean;
  isNoData: boolean;

  tab1Root = HomePage;
  tab2Root = HomePage;
  tab3Root = HomePage;
  tab4Root = HomePage;
  tab5Root = HomePage;

  constructor(public navCtrl: NavController,
    private userProv: UseraccountProvider
    , private MasterdataProv: MasterdataProvider
  ) {

  }
  ///Method
  ionViewDidLoad() {

    this.userProv.getUserAccount().then((value: UserAccount) => {
      this.usrdata = value;
      this.isHasService = false;
      this.isNoData = true;
      if (value != undefined && value.code != null) {
        this.name = ' ' + value.fname + '  ' + value.lname;
        this.position = value.posname;
        this.organization = value.unitname;
        this.photo = value.photo != null ? value.photo : '';

        this.BindDocumentList();
      } else {
        this.navCtrl.push(LoginPage);
      }

    });
  }

  BindDocumentList(isScroll?: boolean) {

    let _UserID = (this.usrdata == null) ? '' : this.usrdata.userid;
    console.log(_UserID)
    // let _RoleID = (this.usrdata == null) ? '' : this.usrdata.role;
    this.sub = this.MasterdataProv.getDocument_Trans('request_list', '', ['', '', '', '', _UserID], this.nStart, this.nTop).subscribe(
      (res) => {
        if (isScroll && this.lstDoc.length > 0)
          this.lstDoc = this.lstDoc.concat(res);
        else
          this.lstDoc = res;

        this.nStart = this.lstDoc.length;
        this.nTotalRows = this.lstDoc.length;
        this.isHasService = this.nTotalRows > 0;
        this.isNoData = this.nTotalRows == 0;

        console.log(this.lstDoc)
      },
      (error) => { this.errorMessage = <any>error }
    );
  }


  viewdetail(nID) {
    this.navCtrl.push(DetailPage, { nID: nID });
  }
}
