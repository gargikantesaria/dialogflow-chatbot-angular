import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HoldableDirective } from './directives/holdable.directive';



@NgModule({
  declarations: [
    HoldableDirective
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    HoldableDirective
  ]
})
export class SharedModule { }
