import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
///providers 
import { UseraccountProvider } from '../../providers/useraccount/useraccount';
///models
import { UserAccount } from '../../models/useraccount';
///Pages 
// import { MytaskPage } from '../mytask/mytask';
// import { SearchPage } from '../search/search';
// import { ScanmodePage } from '../scanmode/scanmode';
// import { MyprofilePage } from '../myprofile/myprofile';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  logined: boolean;
  name: string;
  position: string;
  organization: string;
  photo: string;
  versionNumber: string = '';

  tab1Root = HomePage;
  tab2Root = HomePage;
  tab3Root = HomePage;
  tab4Root = HomePage;
  tab5Root = HomePage;

  constructor(public navCtrl: NavController,
    private userProv: UseraccountProvider) {

  }
  ///Method
  ionViewDidLoad() {


    this.userProv.getUserAccount().then((value: UserAccount) => {
      if (value != undefined && value.code != null) {
        this.name = 'คุณ' + value.fname + '  ' + value.lname;
        this.position = value.posname;
        this.organization = value.unitname;
        this.photo = value.photo != null ? value.photo : '';
      }
    });
  }
}
