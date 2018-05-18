import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { Subscription } from 'rxjs/Subscription'; //import Subscription เพื่อ unsubscribe() ข้อมูลจาก Server
////import providers
import { UseraccountProvider } from '../../providers/useraccount/useraccount';
//import models
import { UserAccount } from '../../models/useraccount';


import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  txtUsername: string;
  txtPassword: string;
  errorMessage: string;
  usracc: UserAccount;

  logined: boolean;

  myForm: FormGroup;
  username: FormControl;
  password: FormControl;
  remember: FormControl;
  user: UserAccount;
  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController
    , private loadingCtrl: LoadingController, private alertCtrl: AlertController
    , private userProv: UseraccountProvider
    , public storage: Storage
    , private formBdr: FormBuilder) {

    //ตรวจสอบความถูกต้องของฟอร์ม เช่น required, minLength
    this.username = this.formBdr.control('', Validators.required);
    this.password = this.formBdr.control('', Validators.compose([Validators.required, Validators.minLength(8)]));
    this.remember = this.formBdr.control('');

    this.myForm = this.formBdr.group({ 'username': this.username, 'password': this.password, 'remember': this.remember });

    this.userProv.createTable();
  }

  ionViewWillEnter() {
    //เมื่อเข้าหน้า login ให้ตรวจสอบก่อนว่าเคย login แล้วยัง หากเคยให้ไปยังหน้า HomePage
    this.userProv.isLogged().then((res: boolean) => {
      this.logined = res;
      if (this.logined) {
        this.navCtrl.setRoot(HomePage);
      }
    });
  }
  ionViewDidLoad() {

  }
  presentToast(err) {
    let toast = this.toastCtrl.create({
      message: err,
      duration: 3000,
      position: 'buttom'
    });

    toast.onDidDismiss(() => {
      //console.log('Dismissed toast');
    });

    toast.present();
  }

  login(): void {
    //แสดง loading controller
    let loader = this.loadingCtrl.create({ content: "Loading..." });
    loader.present();

    //รับข้อมูลต่างๆมาจากฟอร์ม
    let username = this.myForm.controls['username'].value;
    let password = this.myForm.controls['password'].value;
    let remember = true;

    this.userProv.login(username, password, remember).then((res: boolean) => {
      console.log(username + ' ' + password)
      this.logined = res;
      if (this.logined) {
        this.navCtrl.setRoot(HomePage);
      }
      else {
        //แจ้งเตือนกรณี username และ password ไม่ถูกต้อง
        let alert = this.alertCtrl.create({ title: 'รหัสพนักงานและรหัสผ่านไม่ถูกต้อง!', buttons: ['ตกลง'] });
        alert.present();
      }

      loader.dismiss();//ให้ Loading หายไปกรณีเกิดการทำงานเสร็จสมบูรณ์
    }).catch(error => {
      loader.dismiss();//ให้ Loading หายไปกรณีที่เกิด error
    });
  }
  logout() {


  }
}