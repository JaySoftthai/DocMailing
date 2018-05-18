import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
///providers
import { ApiProvider } from '../../providers/api/api';
import { UseraccountProvider } from '../../providers/useraccount/useraccount';
///models
import { UserAccount } from '../../models/useraccount';

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
  constructor(public navCtrl: NavController,
    private apiProv: ApiProvider,
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
