// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { ApiProvider } from '../api/api';

import { Autocompletereturn } from '../../models/autocompletereturn';
// import { Customerfavourite } from '../../models/customerfavourite';

@Injectable()
export class AutocompletesProvider {

  constructor(public http: Http, private apiProvider: ApiProvider) { }

  getSale(sKeyword, nStart): Observable<Autocompletereturn[]> {
    let sFile_Handler = 'autocompletes.ashx?sMode=sale&sKeyword=' + sKeyword + "&nStart=" + nStart;
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  getComapany(sKeyword, nStart, sCode): Observable<Autocompletereturn[]> {
    let sFile_Handler = 'autocompletes.ashx?sMode=company&sKeyword=' + sKeyword + "&nStart=" + nStart + "&sCode=" + sCode;
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  getSoldTo(sKeyword, nStart, sCompanyCode): Observable<Autocompletereturn[]> {
    let sFile_Handler = 'autocompletes.ashx?sMode=soldto&sKeyword=' + sKeyword + "&nStart=" + nStart + "&sCompanyCode=" + sCompanyCode;
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  getShipTo(sKeyword, nStart, sCompanyCode): Observable<Autocompletereturn[]> {
    let sFile_Handler = 'autocompletes.ashx?sMode=shipto&sKeyword=' + sKeyword + "&nStart=" + nStart + "&sCompanyCode=" + sCompanyCode;
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  getStaff(sKeyword, nStart, sCompanyCode): Observable<Autocompletereturn[]> {
    let sFile_Handler = 'autocompletes.ashx?sMode=staff&sKeyword=' + sKeyword + "&nStart=" + nStart + "&sCompanyCode=" + sCompanyCode;
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  getStaff2(sKeyword, nStart, sCompanyID): Observable<Autocompletereturn[]> {
    let sFile_Handler = 'autocompletes.ashx?sMode=staff2&sKeyword=' + sKeyword + "&nStart=" + nStart + "&sCompanyID=" + sCompanyID;
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  getCustType(): Observable<Autocompletereturn[]> {
    let sFile_Handler = 'autocompletes.ashx?sMode=custtype&sKeyword=&nStart=';
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  getCustHead(): Observable<Autocompletereturn[]> {
    let sFile_Handler = 'autocompletes.ashx?sMode=custhead&sKeyword=&nStart=';
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  getStaffLevel(sCompanyID?): Observable<Autocompletereturn[]> {
    let sFile_Handler = 'autocompletes.ashx?sMode=stafflevel&sKeyword=&nStart=&sCompanyID=' + (sCompanyID != undefined ? sCompanyID : '');
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  getStaffPosition(sCompanyID?): Observable<Autocompletereturn[]> {
    let sFile_Handler = 'autocompletes.ashx?sMode=staffposition&sKeyword=&nStart=&sCompanyID=' + (sCompanyID != undefined ? sCompanyID : '');
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  getStaffTitle(): Observable<Autocompletereturn[]> {
    let sFile_Handler = 'autocompletes.ashx?sMode=stafftitle&sKeyword=&nStart=';
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  getManufacturer(): Observable<Autocompletereturn[]> {
    let sFile_Handler = 'autocompletes.ashx?sMode=manufacturer&sKeyword=&nStart=';
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  getComplaintGroup(): Observable<Autocompletereturn[]> {
    let sFile_Handler = 'autocompletes.ashx?sMode=complaintgroup&sKeyword=&nStart=';
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  getRequestType(): Observable<Autocompletereturn[]> {
    let sFile_Handler = 'autocompletes.ashx?sMode=requesttype&sKeyword=&nStart=';
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  getSuggestionType(): Observable<Autocompletereturn[]> {
    let sFile_Handler = 'autocompletes.ashx?sMode=suggestiontype&sKeyword=&nStart=';
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  // getFavourite(): Observable<Customerfavourite[]> {
  //   let sFile_Handler = 'autocompletes.ashx?sMode=favourite&sKeyword=&nStart=';
  //   return this.apiProvider.getApiEndpoint(sFile_Handler);
  // }

  getDocType(): Observable<Autocompletereturn[]> {
    let sFile_Handler = 'autocompletes.ashx?sMode=ebooktype&sKeyword=&nStart=';
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }
}
