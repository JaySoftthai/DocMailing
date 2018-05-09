import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { HttpModule } from '@angular/http';
import { Network } from '@ionic-native/network';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { SearchPage } from '../pages/search/search';
import { SearchPopoverPage } from '../pages/search-popover/search-popover';
import { FilesPopoverPage } from '../pages/files-popover/files-popover';
import { DetailPage } from '../pages/detail/detail';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from '../providers/api/api';
import { LocationServicesProvider } from '../providers/location-services/location-services';
import { AutocompletesProvider } from '../providers/autocompletes/autocompletes';
import { MasterdataProvider } from '../providers/masterdata/masterdata';
// import { UserloginProvider } from '../providers/userlogin/userlogin';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage, SearchPage, DetailPage
    , SearchPopoverPage, FilesPopoverPage
  ],
  imports: [
    BrowserModule, HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage, SearchPage, DetailPage
    , SearchPopoverPage, FilesPopoverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite, Network,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiProvider
    , LocationServicesProvider,
    AutocompletesProvider,
    MasterdataProvider
    // ,UserloginProvider
  ]
})
export class AppModule { }

