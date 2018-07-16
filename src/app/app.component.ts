import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import { HomePage } from '../pages/home/home';
// import { ListPage } from '../pages/list/list';
import { SearchPage } from '../pages/search/search';
import { AppDataPage } from '../pages/app-data/app-data';
import { AppInboundPage } from '../pages/app-inbound/app-inbound';
import { AppOutboundPage } from '../pages/app-outbound/app-outbound';
import { AppTrackStatusPage } from '../pages/app-track-status/app-track-status';
import { AppRevievStatusPage } from '../pages/app-reviev-status/app-reviev-status';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
// import { SignaturePage } from '../pages/signature/signature';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'หน้าหลัก', component: HomePage },
      // { title: 'สแกนรับเข้าเอกสาร', component: AppDataPage },
      // { title: 'สแกนรับเข้าเอกสารส่ง บก.', component: AppInboundPage },
      // { title: 'สแกนรับเอกสารจาก บก.', component: AppOutboundPage },
      { title: 'สแกนเปลี่ยนสถานะ(ส่งเอกสาร)', component: AppTrackStatusPage },
      { title: 'สแกนเปลี่ยนสถานะ(รับเอกสาร)', component: AppRevievStatusPage },
      { title: 'ค้นหาเอกสาร', component: SearchPage },
      { title: 'ข้อมูลผู้ใช้งาน', component: LoginPage },
      // { title: 'ออกจากระบบ', component: LogoutPage }
      // ,{ title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.splashScreen.show();
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  public price = 0;
  private currencyMask = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2,
    integerLimit: null,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: false
  });
}
