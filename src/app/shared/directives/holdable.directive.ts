import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: '[holdable]'
})
export class HoldableDirective {

  @Output() stopRec = new EventEmitter();
  @Output() startRec = new EventEmitter();
  stop$ = new Subject<any>();

  constructor() {
    this.stop$.subscribe(() => {
      this.stopRec.emit();
    });
  }

  @HostListener('mouseup', [])
  onExit() {
    this.stop$.next('');
    // to remove animation
    document.getElementById('voice-mic-btn').classList.remove('mic-icon-animation');
    // allow to display tooltip again after release icon
    document.getElementById('voice-mic-btn').classList.add('tooltip-container');
  }

  @HostListener('mousedown', [])
  onHold() {
    this.startRec.emit();
    // to add animation
    document.getElementById('voice-mic-btn').classList.add('mic-icon-animation');
    // hide displaying of tooltip till hold
    document.getElementById('voice-mic-btn').classList.remove('tooltip-container');
  }

  // same as mouseup, when mouse moved out from div of mic button , stop the voice recording.
  @HostListener('mouseleave', [])
  stopVoiceRec(){
    if(document.getElementById('voice-mic-btn').classList.contains('mic-icon-animation')){
      this.onExit();
    }
  }
}
