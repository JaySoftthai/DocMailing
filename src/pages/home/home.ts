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


    // this.appVersion.getAppName().then(res => {
    //   this.versionNumber += ' getAppName: ' + res;
    // }).catch(err => {
    //   this.versionNumber += ' getAppName Error' + err;
    // });
    // this.appVersion.getPackageName().then(res => {
    //   this.versionNumber += ' getPackageName: ' + res;
    // }).catch(err => {
    //   this.versionNumber += ' getPackageName Error' + err;
    // });
    // this.appVersion.getVersionCode().then(res => {
    //   this.versionNumber += ' getVersionCode: ' + res;
    // }).catch(err => {
    //   this.versionNumber += ' getVersionCode Error' + err;
    // });
    // this.appVersion.getVersionNumber().then(res => {
    //   this.versionNumber += ' getVersionNumber: ' + res;
    // }).catch(err => {
    //   this.versionNumber += ' getVersionNumber Error: ' + err;
    // });
    // // console.log(this.appVersion.getVersionNumber()); 
    // // this.BindVersion();



  }
}
