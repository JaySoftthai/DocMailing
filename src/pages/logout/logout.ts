import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
///providers
// import { ApiProvider } from '../../providers/api/api';
import { UseraccountProvider } from '../../providers/useraccount/useraccount';
///models
import { UserAccount } from '../../models/useraccount';
//Page
import { LoginPage } from '../login/login';


// @IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams
    // , private apiProv: ApiProvider
    , private userProv: UseraccountProvider) {
  }

  ionViewDidLoad() {

    this.userProv.logout().then((value: UserAccount) => {
      if (value == undefined || value.code == null)
        this.navCtrl.push(LoginPage);
    });
  }

}
