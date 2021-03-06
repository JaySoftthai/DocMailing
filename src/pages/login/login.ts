import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AppVersion } from '@ionic-native/app-version';

// import { Subscription } from 'rxjs/Subscription'; //import Subscription เพื่อ unsubscribe() ข้อมูลจาก Server
////import providers
import { UseraccountProvider } from '../../providers/useraccount/useraccount';
//import models
import { UserAccount } from '../../models/useraccount';

import { HomePage } from '../home/home';

// @IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  txtUsername: string;
  txtPassword: string;
  ddlUserGroup: string;
  errorMessage: string;
  usracc: UserAccount;

  logined: boolean;
  logouted: boolean;

  myForm: FormGroup;
  username: FormControl;
  password: FormControl;
  usergroup: FormControl;
  remember: FormControl;
  user: UserAccount;
  fullname: string;
  userphotoUrl: string;
  userposition: string;
  CurrVersion: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController
    , private loadingCtrl: LoadingController, private alertCtrl: AlertController
    , private userProv: UseraccountProvider
    , public storage: Storage, private cordova: AppVersion
    , private formBdr: FormBuilder) {

    //ตรวจสอบความถูกต้องของฟอร์ม เช่น required, minLength
    this.username = this.formBdr.control('', Validators.required);
    this.usergroup = this.formBdr.control('', Validators.required);
    this.password = this.formBdr.control('', Validators.compose([Validators.required, Validators.minLength(8)]));
    this.remember = this.formBdr.control('');

    this.myForm = this.formBdr.group({ 'username': this.username, 'password': this.password, 'remember': this.remember, 'usergroup': this.usergroup });

    this.userProv.createTable();
  }

  ionViewWillEnter() {
    //เมื่อเข้าหน้า login ให้ตรวจสอบก่อนว่าเคย login แล้วยัง หากเคยให้ไปยังหน้า HomePage 
    this.userProv.isLogged().then((res: boolean) => {
      this.logined = res;
      this.logouted = !this.logined;
      if (this.logined) {

        this.userProv.getUserAccount().then((value: UserAccount) => {
          if (value != undefined && value.code != null) {
            this.user = value;
            this.fullname = ' ' + value.fname + '  ' + value.lname;
            this.userposition = value.poscode + '';
            this.userphotoUrl = value.photo != null ? value.photo : 'assets/images/human.png';
            // this.organization = value.unitname;
          }
        });
        return false;// this.navCtrl.setRoot(HomePage);
      } else { return false; }
    });
  }
  ionViewDidLoad() {
    this.CurrVersion = '0.1.1'

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
    // console.log(this.myForm.controls['usergroup'].value)
    if (this.myForm.controls['username'].value == undefined || this.myForm.controls['password'].value == undefined || this.myForm.controls['usergroup'].value == undefined) {

      this.presentToast('กรุณาระบุข้อมูลเพื่อยืนยันการเข้าใช้งานทั้งหมดให้ถูกต้องครบถ้วน');
    } else {
      //แสดง loading controller
      let loader = this.loadingCtrl.create({ content: "Loading..." });
      loader.present();

      //รับข้อมูลต่างๆมาจากฟอร์ม 
      let username = this.myForm.controls['username'].value;
      let password = this.myForm.controls['password'].value;
      let usergroup = this.myForm.controls['usergroup'].value;
      let remember = true;
      usergroup = (usergroup + "" != "") ? ((usergroup == "") ? "BSA" : usergroup).replace("BSA", "") : usergroup;
      this.userProv.login(usergroup + "" + username, password, remember).then((res: boolean) => {
        /*nSubID	nMainID	sName
  9		บก.
  10	Courier
  11	Messenger */
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
  }
  logout() {

    this.userProv.logout().then((res: boolean) => {
      // console.log('logout:' + res)
      this.logined = res;
      this.logouted = !this.logined;
      this.navCtrl.setRoot(LoginPage);

    });

  }
}
