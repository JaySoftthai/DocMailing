import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { HttpModule } from '@angular/http';
import { Network } from '@ionic-native/network';
import { AppVersion } from '@ionic-native/app-version';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SignaturePadModule } from 'angular2-signaturepad';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { TextMaskModule } from 'angular2-text-mask';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SearchPage } from '../pages/search/search';
import { SearchPopoverPage } from '../pages/search-popover/search-popover';
import { FilesPopoverPage } from '../pages/files-popover/files-popover';
import { DetailPage } from '../pages/detail/detail';
import { AppDataPage } from '../pages/app-data/app-data';
import { AppInboundPage } from '../pages/app-inbound/app-inbound';
import { AppOutboundPage } from '../pages/app-outbound/app-outbound';
import { AppTrackStatusPage } from '../pages/app-track-status/app-track-status';
import { AppRevievStatusPage } from '../pages/app-reviev-status/app-reviev-status';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
import { SignaturePage } from '../pages/signature/signature';
// import { MyprofilePage } from '../pages/myprofile/myprofile';
// import { MytaskPage } from '../pages/mytask/mytask';
// import { ScanmodePage } from '../pages/scanmode/scanmode';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from '../providers/api/api';
import { LocationServicesProvider } from '../providers/location-services/location-services';
import { AutocompletesProvider } from '../providers/autocompletes/autocompletes';
import { MasterdataProvider } from '../providers/masterdata/masterdata';
import { UseraccountProvider } from '../providers/useraccount/useraccount';
// import { UserloginProvider } from '../providers/userlogin/userlogin';

@NgModule({
  declarations: [
    MyApp,
    HomePage
    , SearchPage, DetailPage
    , SearchPopoverPage, FilesPopoverPage, AppDataPage, AppInboundPage, AppOutboundPage, AppTrackStatusPage
    , LoginPage, LogoutPage, SignaturePage, AppRevievStatusPage
    // , MyprofilePage, MytaskPage, ScanmodePage
  ],
  imports: [
    BrowserModule, HttpModule, TextMaskModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(), SignaturePadModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
    , SearchPage, DetailPage, AppDataPage, AppInboundPage, AppOutboundPage
    , SearchPopoverPage, FilesPopoverPage, AppTrackStatusPage
    , LoginPage, LogoutPage, SignaturePage, AppRevievStatusPage
    // , MyprofilePage, MytaskPage, ScanmodePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite, Network,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiProvider
    , LocationServicesProvider,
    AutocompletesProvider
    , MasterdataProvider, AppVersion, Base64ToGallery, BarcodeScanner, UseraccountProvider
    // ,UserloginProvider
    , Camera
    , File
    , FileTransfer
    , FilePath
  ]
})
export class AppModule { }

