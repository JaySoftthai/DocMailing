import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Network } from '@ionic-native/network';
import { isNumber } from 'ionic-angular/util/util';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import 'rxjs/add/operator/toPromise';

import { Autocompletereturn } from '../../models/autocompletereturn';


@Injectable()
export class ApiProvider {
  apiUrl: string;
  epiUrl: string;
  UploadUrl: string;

  constructor(public http: Http, public network: Network) {
    // this.apiUrl = "http://localhost:1871/Mobile/";
    // this.apiUrl = "http://dev2012/PTT_Doc_Mailing/Mobile/";
    // this.apiUrl = "http://www.softthai.com/ptt_doc_mailing/Mobile/";
    // this.apiUrl = "https://pttwebtest11.pttplc.com/PTT_Doc_Mailing_Test/Mobile/";
    this.apiUrl = "https://pttweb11.pttplc.com/PTT_Doc_Mailing/mobile/";//2018-12-03 change to Prd

    // this.epiUrl = "http://localhost:1871/Mobile/";
    // this.epiUrl = "http://dev2012/PTT_Doc_Mailing/Mobile/";
    // this.epiUrl = "http://www.softthai.com/ptt_doc_mailing/Mobile/";
    // this.epiUrl = "https://pttwebtest11.pttplc.com/PTT_Doc_Mailing_Test/Mobile/";
    this.apiUrl = "https://pttweb11.pttplc.com/PTT_Doc_Mailing/mobile/";//2018-12-03 change to Prd

    // this.epiUrl = "http://localhost:1871/Mobile/";
    // this.epiUrl = "http://dev2012/PTT_Doc_Mailing/Mobile/";
    // this.epiUrl = "http://www.softthai.com/ptt_doc_mailing/Mobile/";
    // this.UploadUrl = "https://pttwebtest11.pttplc.com/PTT_Doc_Mailing_Test/Mobile/";
    this.apiUrl = "https://pttweb11.pttplc.com/PTT_Doc_Mailing/mobile/";//2018-12-03 change to Prd

  }

  getApiUrl(): string { return this.apiUrl; }
  getWebUrl(): string { return this.epiUrl; }
  getUploadUrl(): string { return this.UploadUrl; }


  //ดึงข้อมูลจาก Backend ด้วย method get() ตาม URL ที่ระบุไว้
  //คำสั่ง .map() ให้พิมพ์ติดกันกับ .get() ก่อนค่อย enter ลงมาได้
  //<any[]> res.json() แปลง json จากฝั่ง backend ให้กับโมเดล คลาส any
  getApiEndpoint(sFile_Handler: string): Observable<any> {
    return this.http.get(this.apiUrl + sFile_Handler)
      .map((res: Response) => <any>res.json())
      .catch(this.handleError);
  }
  postApiEndpoint(sFile_Handler: string, jsStringItem: string, imgSignature: string): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + sFile_Handler, jsStringItem)
        .subscribe(res => {
          resolve(res);
          // this.data.response = res["_body"];
        }, (err) => {
          reject(err);
        });
    });
  }
  getUploadEndpoint(sFile_Handler: string): Observable<any> {
    return this.http.get(this.UploadUrl + sFile_Handler)
      .map((res: Response) => <any>res.json())
      .catch(this.handleError);
  }
  postUploadEndpoint(sFile_Handler: string, jsStringItem: string, imgSignature: string): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http.post(this.UploadUrl + sFile_Handler, jsStringItem)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
  getApiEndpointWithObject(sFile_Handler: string, jsStringItem: string): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + sFile_Handler, jsStringItem)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  //method handleError เป็น method สำหรับดักจับข้อผิดพลาดที่ส่งมาจาก Backend
  // error.json().errorMessage คำสั่ง .errorMessage เป็น name ของ json ในส่วนของ Backend ขึ้นกับว่าตั้งอะไรไว้
  //หากไม่มี error ส่งมาจาก Backend จะใช้ข้อความ 'เกิดข้อผิดพลาดจาก Server' แทน
  private handleError(error: any) {
    return Observable.throw(error.json().errorMessage || 'เกิดข้อผิดพลาดจาก Server');
  }

  public connection = () => {
    return this.network.type;
  }
  public onDisconnect = (): Observable<any> => {
    return this.network.onDisconnect();
  }
  public onConnect = (): Observable<any> => {
    return this.network.onConnect();
  }

  public convertStrDateToDate(value): Date {
    return value == null ? null : new Date(parseInt(value.match(/\d+/)[0]));
  }
  public convertStrToInteger(value: string): number {
    return isNumber(value) || !this.isEmpty(value) ? parseInt(value) : null;
  }
  public convertStrToNumber(value: string): number {
    return isNumber(value) || !this.isEmpty(value) ? parseFloat(value) : null;
  }

  public isEmpty(value): boolean {
    return value == undefined || value == null || value == '';
  }
  public getMonth(): Autocompletereturn[] {
    let lstMonth: Autocompletereturn[] = [];

    lstMonth.push(new Autocompletereturn(0, "January"));
    lstMonth.push(new Autocompletereturn(1, "February"));
    lstMonth.push(new Autocompletereturn(2, "March"));
    lstMonth.push(new Autocompletereturn(3, "April"));
    lstMonth.push(new Autocompletereturn(4, "May"));
    lstMonth.push(new Autocompletereturn(5, "June"));
    lstMonth.push(new Autocompletereturn(6, "July"));
    lstMonth.push(new Autocompletereturn(7, "August"));
    lstMonth.push(new Autocompletereturn(8, "September"));
    lstMonth.push(new Autocompletereturn(9, "October"));
    lstMonth.push(new Autocompletereturn(10, "November"));
    lstMonth.push(new Autocompletereturn(11, "December"));

    return lstMonth;
  }
}
