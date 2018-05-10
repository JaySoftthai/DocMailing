import { Directive } from '@angular/core';//, Renderer, ElementRef 
//import { Keyboard } from '@ionic-native/keyboard';


@Directive({
  selector: '[auto-focus]' // Attribute selector
})
export class AutoFocusDirective {

  constructor(//private renderer: Renderer,
    //private elementRef: ElementRef,
    //private keyboard: Keyboard
  ) {
  }

  // ngAfterViewInit() {
  //   const element = this.elementRef.nativeElement.querySelector('input');
  //   // we need to delay our call in order to work with ionic ...
  //   setTimeout(() => {
  //     this.renderer.invokeElementMethod(element, 'focus', []);
  //     this.keyboard.show();
  //   }, 0);
  // }
}
