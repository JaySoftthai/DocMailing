

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
      sFile_Handler = 'master_data.ashx?sMode=' + sDataType + '&nStart=' + nStartRow + '&nTopRow=' + nTopRow + '&sKeyword=' + sKeyword + '&sReqDate=' + sSearchData[0] + '&sCounterService=' + sSearchData[1] + '&sTrackingNumber=' + sSearchData[2] + '&sStatus=' + sSearchData[3];
    }

    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  postDocument_ScanStat_3(sDataType, jsnData, imgSignature, UserScan): Promise<any> {
    let sFile_Handler = 'transaction_status.ashx';
    return this.apiProvider.postApiEndpoint(sFile_Handler, JSON.stringify({ img: imgSignature, sUserID: UserScan, sAssignUserID: UserScan, itm: jsnData }), imgSignature);

  }


  getReqDocument(sDataType, sDocID): Observable<trans_request[]> {
    let sFile_Handler = 'master_data.ashx?sMode=' + sDataType + '&sKeyword=' + sDocID;

    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  getFilesDocument(sDataType, sDocID): Observable<files_request[]> {
    let sFile_Handler = 'master_data.ashx?sMode=' + sDataType + '&sKeyword=' + sDocID;

    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }
  ///End Method
}
