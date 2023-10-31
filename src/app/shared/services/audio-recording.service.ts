import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { RecordedAudioOutput } from 'src/app/chat/model/chat.model';
import * as moment from 'moment';
import * as RecordRTC from 'recordrtc';

@Injectable({
  providedIn: 'root'
})
export class AudioRecordingService {

  private stream;
  private recorder;
  private interval;
  private startTime;
  private _recorded = new Subject<RecordedAudioOutput>();
  private _recordingTime = new Subject<string>();
  private _recordingFailed = new Subject<string>();

  // to get recorded audio
  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this._recorded.asObservable();
  }

  // to get recorded time
  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  // if recording fail
  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }

  // to start audio recording
  startRecording() {
    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }

    this._recordingTime.next('00:00');
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.stream = stream;
      this.record();
    }).catch(error => {
      console.log(error);
      this._recordingFailed.next('');
    });

  }

  // to abort (clear) recording 
  abortRecording() {
    this.stopMedia();
  }

  // for recording
  private record() {
    this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
      type: 'audio',
      mimeType: 'audio/webm',
      numberOfAudioChannels: 1,
    });

    this.recorder.record();
    this.startTime = moment();
    this.interval = setInterval(
      () => {
        const time = this.toString(moment.duration(moment().diff(this.startTime)).minutes()) + ':' + this.toString(moment.duration(moment().diff(this.startTime)).seconds());
        this._recordingTime.next(time);
      },
      1000
    );
  }

  private toString(value) {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  // to stop audio recording
  stopRecording() {
    if (this.recorder) {
      this.recorder.stop((blob) => {
        if (this.startTime) {
          const mp3Name = encodeURIComponent('audio_' + new Date().getTime() + '.mp3');
          this.stopMedia();
          this._recorded.next({ blob: blob, title: mp3Name });
        }
      }, () => {
        this.stopMedia();
        this._recordingFailed.next('');
      });
    }
  }

  // to reset media after recording stop
  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach(track => track.stop());
        this.stream = null;
      }
    }
  }
}
