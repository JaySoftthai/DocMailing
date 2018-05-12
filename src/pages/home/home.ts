import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  versionNumber: string = '';
  constructor(public navCtrl: NavController, public appVersion: AppVersion) {

  }
  ///Method
  ionViewDidLoad() {
    this.appVersion.getVersionNumber().then(res => {
      this.versionNumber = res;
    }).catch(err => {
      this.versionNumber = err;
    });
    // console.log(this.appVersion.getVersionNumber()); 
    // this.BindVersion();



  }
}
