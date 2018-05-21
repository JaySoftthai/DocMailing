
import { Injectable } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
////import providers
import { ApiProvider } from '../api/api';
//import models
import { UserAccount } from '../../models/useraccount';

@Injectable()
export class UseraccountProvider {

  constructor(public http: HttpModule, private apiProvider: ApiProvider
    , public sqlite: SQLite
    , public storage: Storage
    , public platform: Platform
    // , private navCtrl: NavController
  ) { }

  ///Method  

  createTable(): void {
    if (this.platform.is('core')) {
      // ถ้า platform พร้อมใช้งาน
      this.platform.ready().then(() => {
        // สร้างฐานข้อมูลชื่อว่า data.db
        this.sqlite.create({
          name: "data.db", location: "default"
        })
          .then((db: SQLiteObject) => {
            //หากยังไม่มีตาราง login ก็ให้สร้างตารางใหม่ หากมีแล้วก็ไม่ต้องสร้าง
            db.executeSql("CREATE TABLE IF NOT EXIST login (id INTEGER PRIMAY KEY AUTOINCREMENT, userid TEXT)", {})
              .then((data) => { }, (error) => { });
          }, (error) => { });
      });
    }
  }
  getUser(code: string, password: string): Observable<UserAccount> {
    let sFile_Handler = 'userlogin.ashx?typ=&usr=' + encodeURIComponent(code) + '&pwd=' + encodeURIComponent(password);
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  login(username: string, password: string, remember: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getUser(username, password).subscribe(res => {

        let isSuccess = res != undefined && res.code != null;
        if (isSuccess) {
          this.storage.ready().then(() => { this.storage.set('useraccount', res); });

          //กรณีต้องการให้จดจำการใช้งานให้บันทึกข้อมูล Login ลงฐานข้อมูล
          if (remember && this.platform.is('core')) {
            //บันทึกข้อมูลการ login ลงฐานข้อมูล
            this.sqlite.create({ name: "data.db", location: "default" })
              .then((db: SQLiteObject) => {
                db.executeSql("INSERT INTO login (userid) VALUES (?)", [res.code])
                  .then((data) => { }, (error) => { });
              });
          }
        }
        resolve(isSuccess);
      }, (error) => reject(false));

    });
  }

  logout(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.storage.ready().then(() => {
        this.storage.get("useraccount").then((value: UserAccount) => {

          //ลบออกจากฐานข้อมูล
          if (this.platform.is('core')) {
            this.sqlite.create({
              name: "data.db", location: "default"
            }).then((db: SQLiteObject) => {
              db.executeSql("DELETE FROM login WHERE userid=?", [value.code])
                .then((data) => { }, (error) => { });
            });
          }

          let isRemoved = this.storage.remove('useraccount');
          // console.log(resolve(isRemoved) == undefined)
          resolve((resolve(isRemoved) == undefined));
        }, () => reject(false));
      });

    });
  }

  getUserAccount(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.ready().then(() => {
        this.storage.get("useraccount").then((value: UserAccount) => resolve(value), (reason) => reject(reason));
      });
    });
  }

  isLogged(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.ready().then(() => {
        this.storage.get("useraccount").then((value: UserAccount) => resolve(value != undefined && value.code != null), (reason) => reject(false));
      });
    });
  }
  goToLogin() {

  }
}
