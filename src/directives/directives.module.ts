import { NgModule } from '@angular/core';
import { AutoFocusDirective } from './auto-focus/auto-focus';
import { AutoResizeDirective } from './auto-resize/auto-resize';
// import { TooltipsModule } from 'ionic-tooltips';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
	declarations: [AutoFocusDirective,
		AutoResizeDirective],
	imports: [],
	exports: [AutoFocusDirective,
		AutoResizeDirective]
})
export class DirectivesModule { }
