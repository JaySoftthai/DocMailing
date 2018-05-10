import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


@IonicPage()
@Component({
  selector: 'page-app-data',
  templateUrl: 'app-data.html',
})
export class AppDataPage {
  Master_DATA: Array<Object>;
  isToogle: boolean = false;


  constructor(public sqlite: SQLite,
    public toastCtrl: ToastController,
    public platform: Platform,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.platform.ready().then(() => {

    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AppDataPage');
  }

}
