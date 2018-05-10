// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpModule } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


import { ApiProvider } from '../api/api';


import { Servicelocations } from '../../models/servicelocations';


@Injectable()
export class LocationServicesProvider {

  constructor(public http: HttpModule, private apiProvider: ApiProvider) { }

  ///Method
  getLocationServices_Master(sKeyword): Observable<Servicelocations[]> {
    let sFile_Handler = 'master_data.ashx?sMode=counter_service_list&nStart=0&sKeyword=' + sKeyword;
    return this.apiProvider.getApiEndpoint(sFile_Handler);
  }

  ///End Method
}
