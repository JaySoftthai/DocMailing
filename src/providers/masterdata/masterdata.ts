

// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpModule } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


import { ApiProvider } from '../api/api';


import { Servicelocations } from '../../models/servicelocations';
import { Step } from '../../models/step';
import { trans_request } from '../../models/trans_request';
import { files_request } from '../../models/files_request';



@Injectable()
export class MasterdataProvider {

  constructor(public http: HttpModule, private apiProvider: ApiProvider) { }

  ///Method
  getCounterServices_Master(sKeyword): Observable<Servicelocations[]> {
    let sFile_Handler = 'master_data.ashx?sMode=counter_service_list&nStart=0&sKeyword=' + sKeyword;
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }
  getData_Master(sDataType, sKeyword, nStartRow, nTopRow): Observable<Step[]> {
    let sFile_Handler = 'master_data.ashx?sMode=' + sDataType + '&nStart=' + nStartRow + '&nTopRow=' + nTopRow + '&sKeyword=' + sKeyword;
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  getDocument_Trans(sDataType, sKeyword, sSearchData, nStartRow, nTopRow): Observable<trans_request[]> {
    let sFile_Handler = 'master_data.ashx?sMode=' + sDataType + '&nStart=' + nStartRow + '&nTopRow=' + nTopRow + '&sKeyword=' + sKeyword;

    if (sSearchData.length > 0) {
      sFile_Handler = 'master_data.ashx?sMode=' + sDataType + '&nStart=' + nStartRow + '&nTopRow=' + nTopRow + '&sKeyword=' + sKeyword + '&sReqDate=' + sSearchData[0] + '&sCounterService=' + sSearchData[1] + '&sTrackingNumber=' + sSearchData[2] + '&sStatus=' + sSearchData[3] + '&usr=' + sSearchData[4];
    }

    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  postDocument_ScanStat_3(sDataType, jsnData, imgSignature, UserScan): Promise<any> {
    let sFile_Handler = 'transaction_status.ashx';
    let ToStep = "3";
    return this.apiProvider.postApiEndpoint(sFile_Handler, JSON.stringify({ img: imgSignature, sUserID: UserScan, sAssignUserID: UserScan, itm: jsnData, NextStep: ToStep }), imgSignature);

  }
  postDocument_ScanStat(sDataType, jsnData, imgSignature, UserScan, ToStep): Promise<any> {
    let sFile_Handler = 'transaction_status.ashx';
    return this.apiProvider.postApiEndpoint(sFile_Handler, JSON.stringify({ img: imgSignature, sUserID: UserScan, sAssignUserID: UserScan, itm: jsnData, NextStep: ToStep }), imgSignature);

  }

  postDocument_ScanStatus(sDataType, StepCurr, StepNext, jsnData, imgSignature, UserScan): Promise<any> {
    let sFile_Handler = 'transaction_scan.ashx';
    // //console.log(StepCurr)
    // //console.log(StepNext)
    // //console.log(sDataType)
    return this.apiProvider.postApiEndpoint(sFile_Handler, JSON.stringify({ CurrStep: StepCurr, NextStep: StepNext, sImgSign: imgSignature, img: imgSignature, sUserID: UserScan, sAssignUserID: UserScan, ScanItemType: sDataType, itm: jsnData }), imgSignature);

  }

  getReqDocument(sDataType, sDocID): Observable<trans_request[]> {
    let sFile_Handler = 'master_data.ashx?sMode=' + sDataType + '&sKeyword=' + sDocID;

    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }
  getReqDocumentByDocCode(sDataType, sDocCode): Observable<trans_request[]> {
    let sFile_Handler = 'master_data.ashx?sMode=' + sDataType + '&sKeyword=' + sDocCode;

    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }
  checkReqDocumentByDocCode(sDataType, sDocCode, sUserCode): Observable<trans_request[]> {
    let sFile_Handler = 'master_data.ashx?sMode=' + sDataType + '&sKeyword=' + sDocCode + '&sUserCode=' + sUserCode;

    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  UPDPriceDocument(sDataType, sDocID, sPrice): Observable<trans_request[]> {
    let sFile_Handler = 'master_data.ashx?sMode=' + sDataType + '&sKeyword=' + sDocID + '&sTrackingNumber=' + sPrice;

    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  getFilesDocument(sDataType, sDocID): Observable<files_request[]> {
    let sFile_Handler = 'master_data.ashx?sMode=' + sDataType + '&sKeyword=' + sDocID;

    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  gettUploadURL() {
    return this.apiProvider.getUploadUrl() + 'uploadfiles.ashx';

  }
  postUploadPicture(sDataType, jsnData, imgSignature, UserScan, ToStep): Promise<any> {
    let sFile_Handler = 'transaction_status.ashx';
    return this.apiProvider.postUploadEndpoint(sFile_Handler, JSON.stringify({ img: imgSignature, sUserID: UserScan, sAssignUserID: UserScan, itm: jsnData, NextStep: ToStep }), imgSignature);

  }
  IsAllowStatus4Scaner(sMode, sScanStatus, sCurrStatus): boolean {
    let res: boolean = true;
    let aray_Send: string = ",2,3,4";
    let aray_Send_LT: string = ",2,3,4,";
    let aray_Send_GT: string = ",5,6,7,8,9,10,";
    let aray_Reciev_LT: string = ",2,3,4,";
    let aray_Reciev_GT: string = ",5,7,14,15,16,18,19,";
    let IsNotPassHeadBGor = (aray_Send.indexOf("," + sCurrStatus + ",") > -1);

    if (sMode == "send") {
      switch (sScanStatus) {
        case "3":
        case "4":
        case "5":
          res = (aray_Send_LT.indexOf("," + sCurrStatus + ",") > -1);
          break;
        case "7":
        case "8":
        case "10":
        case "11":
          res = (aray_Send_GT.indexOf("," + sCurrStatus + ",") > -1);
          break;
        default: res = false; break;
      }

    } else {//revciev

      //console.log('reciev Func  sScanStatus:' + sScanStatus + ' DocStatus:' + sCurrStatus + ' rest:' + (aray_Reciev_LT.indexOf("," + sCurrStatus + ",") > -1))
      switch (sScanStatus) {
        case "3":
        case "4":
        case "5":
          //console.log(aray_Reciev_LT)
          //console.log(aray_Reciev_LT.indexOf(sCurrStatus))
          //console.log(aray_Reciev_LT.indexOf("," + sCurrStatus + ","))
          res = (aray_Reciev_LT.indexOf("," + sCurrStatus + ",") > -1);
          break;
        case "7":
        case "14":
        case "15":
        case "16":
        case "18":
        case "19":
          res = (aray_Reciev_GT.indexOf("," + sCurrStatus + ",") > -1);
          break;
        default: res = false; break;
      }

    }
    return res;
  }
  ///End Method
}
