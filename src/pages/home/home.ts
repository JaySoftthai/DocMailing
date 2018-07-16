import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, Platform, LoadingController, ModalController, ActionSheetController, Loading } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription'; //import Subscription เพื่อ unsubscribe() ข้อมูลจาก Server 
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
///providers 
import { UseraccountProvider } from '../../providers/useraccount/useraccount';
import { trans_request } from '../../models/trans_request';
import { MasterdataProvider } from '../../providers/masterdata/masterdata';
///models
import { UserAccount } from '../../models/useraccount';
///Pages 
// import { MytaskPage } from '../mytask/mytask';
// import { SearchPage } from '../search/search';
// import { ScanmodePage } from '../scanmode/scanmode';
// import { MyprofilePage } from '../myprofile/myprofile';
import { DetailPage } from '../detail/detail';
import { LoginPage } from '../login/login';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  errorMessage: string;
  sub: Subscription;
  usrdata: UserAccount;
  logined: boolean;
  name: string;
  position: string;
  organization: string;
  photo: string;
  versionNumber: string = '';

  nTotalRows: number = 0;//amout all row in db
  nStart: number = 0;//amout Start row display
  nTop: number = 100;//amout Start row display
  lstDoc: trans_request[];
  isHasService: boolean;
  isNoData: boolean;

  tab1Root = HomePage;
  tab2Root = HomePage;
  tab3Root = HomePage;
  tab4Root = HomePage;
  tab5Root = HomePage;

  lastImage: string = null;
  loader: Loading;


  constructor(public navCtrl: NavController,
    private userProv: UseraccountProvider
    , private MasterdataProv: MasterdataProvider
    , private ActShtCtrl: ActionSheetController
    , private camera: Camera
    , private transfer: FileTransfer
    , private file: File
    , private filePath: FilePath
    , public actionSheetCtrl: ActionSheetController
    , public toastCtrl: ToastController
    , public platform: Platform
    , public loadingCtrl: LoadingController

  ) {

  }
  ///Method
  ionViewDidLoad() {

    this.userProv.getUserAccount().then((value: UserAccount) => {
      this.usrdata = value;
      this.isHasService = false;
      this.isNoData = true;
      if (value != undefined && value.code != null) {
        this.name = ' ' + value.fname + '  ' + value.lname;
        this.position = value.posname;
        this.organization = value.unitname;
        this.photo = value.photo != null ? value.photo : '';

        this.BindDocumentList();
      } else {
        this.navCtrl.push(LoginPage);
      }

    });
  }

  BindDocumentList(isScroll?: boolean) {

    let _UserID = (this.usrdata == null) ? '' : this.usrdata.userid;
    // console.log(_UserID)
    // let _RoleID = (this.usrdata == null) ? '' : this.usrdata.role;
    this.sub = this.MasterdataProv.getDocument_Trans('mytask_list', '', ['', '', '', '', _UserID], this.nStart, this.nTop).subscribe(
      (res) => {
        if (isScroll && this.lstDoc.length > 0)
          this.lstDoc = this.lstDoc.concat(res);
        else
          this.lstDoc = res;

        this.nStart = this.lstDoc.length;
        this.nTotalRows = this.lstDoc.length;
        this.isHasService = this.nTotalRows > 0;
        this.isNoData = this.nTotalRows == 0;

      },
      (error) => { this.errorMessage = <any>error }
    );
  }

  viewdetail(nID) {
    this.navCtrl.push(DetailPage, { nID: nID });
  }






  presentActionSheet(nDocID, sDocCode) {
    let actionSheet = this.ActShtCtrl.create({
      title: 'เลือกการดำเนินการ',
      buttons: [
        {
          text: 'ถ่ายรูป',
          icon: 'camera',
          cssClass: 'action-sheet-center',
          handler: () => {

            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'เลือกรูป',
          icon: 'aperture',
          cssClass: 'action-sheet-center',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);

          }
        },
        {
          text: 'ยกเลิก',
          role: 'cancel',
          icon: 'close-circle',
          cssClass: 'action-sheet-center',
          handler: () => {
            // let navTransition =
            actionSheet.dismiss();
            return false;
          }
        }
      ]
    });
    actionSheet.present();
  }
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.' + err.message);
    });
  }
  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }
  public uploadImage() {
    // Destination URL
    var url = this.MasterdataProv.gettUploadURL();


    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { 'fileName': filename, 'DocID': '', 'LineNo': '', 'nStep': '' }
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    this.loader = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loader.present();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loader.dismissAll()
      this.presentToast('Image succesful uploaded.');
    }, err => {
      this.loader.dismissAll()
      this.presentToast('Error while uploading file.');
    });
  }

}
