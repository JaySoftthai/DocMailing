import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';


// @IonicPage()
@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html',

})

export class SignaturePage {
  @ViewChild(SignaturePad) public signaturePad: SignaturePad; // signaturePad: SignaturePad;

  private _canvas: any;
  // @Output() onClear = new EventEmitter();
  constructor(public navCtrl: NavController, public navParams: NavParams
    , public viewCtrl: ViewController
    , private _el: ElementRef) {

  }
  public signatureImage: string;
  public sTT: string;
  //'canvasWidth': 268,
  private signaturepadOptions: Object = {
    'minWidth': 0.5,
    'canvasHeight': 200,
    'backgroundColor': 'rgb(255,255,255)',
  };

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SignaturePage');
  }
  drawComplete() {
    this.signatureImage = this.signaturePad.toDataURL();
    // console.log(this.signatureImage);
    let sSign_URL = this.signatureImage;
    this.viewCtrl.dismiss([sSign_URL, true]);
  }

  // ngAfterViewInit() {
  //   this._canvas = this._el.nativeElement.querySelector("canvas");
  //   this.signaturePad = new SignaturePad(this._canvas);
  // }

  ngAfterViewInit() {
    // this.signaturePad is now available

    // this.signaturePad.resizeCanvas();
    this.canvasResize();
    this.signaturePad.set('minWidth', 0.5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  onClearClick() {
    this.signaturePad.clear();
    // this.onClear.emit();
  }

  onCancelClick() {
    // this.onSave.emit(this.signaturePad.toDataURL());

    let sSign_URL = '';

    sSign_URL = this.signatureImage;
    this.viewCtrl.dismiss([sSign_URL, false]);
  }

  canvasResize() {
    let canvas = document.querySelector('canvas');
    console.log('canvas:canvasResize')
    console.log('window.innerWidth=' + window.innerWidth)
    console.log('window.innerWidth=' + canvas.clientHeight)
    canvas.width = window.innerWidth - 100;
    canvas.height = 200;//canvas.clientHeight;
    this.signaturePad.clear();
  }

}
