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
  public window_innerWidth: number;
  public canvas_clientWidth: number;
  public canvas_clientHeight: number;

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
    /*
    #iPad 
    768*0.70692307692307692307692307692308
    1024*0.56692307692307692307692307692308
    #Phone
    360*0.745
    640*0.925
    */
    let ratio = 0.70692307692307692307692307692308;
    if (window.innerWidth <= 360) {
      ratio = 0.85;
    } else if (window.innerWidth > 360 && window.innerWidth <= 640) {
      ratio = 0.915;//0.921875 0.925;
    } else if (window.innerWidth > 640 && window.innerWidth <= 768) {
      ratio = 0.70692307692307692307692307692308;
    } else if (window.innerWidth > 768 && window.innerWidth <= 1024) {
      ratio = 0.53;
    } else if (window.innerWidth > 1024) {
      ratio = 0.40;
    }


    this.window_innerWidth = window.innerWidth;
    this.canvas_clientWidth = canvas.clientWidth;
    this.canvas_clientHeight = (window.innerWidth * ratio);
    console.log('canvas:canvasResize')
    console.log('window.innerWidth=' + window.innerWidth)
    console.log('canvas.clientWidth=' + canvas.clientWidth)
    console.log('canvas.clientHeight=' + canvas.clientHeight)
    canvas.width = (window.innerWidth * ratio);
    canvas.height = 200;//canvas.clientHeight; 
    this.signaturePad.clear();
  }

}
