import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccessTokenService } from 'src/app/shared/services/access-token.service';
import { AudioRecordingService } from 'src/app/shared/services/audio-recording.service';
import { DialogflowService } from 'src/app/shared/services/dialogflow.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Message } from '../../model/chat.model';

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
export class ChatDialogComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollBottom', { static: true }) private scrollContainer: ElementRef;
  messageList: Message[];
  message: string;
  blobSubscription: Subscription;
  recordedBlobSubscription: Subscription;

  constructor(
    private dialogflowService: DialogflowService,
    private audioRecordingService: AudioRecordingService,
    private accessTokenService: AccessTokenService,
  ){ }

  ngOnInit(): void {
    this.messageList = [];

    !sessionStorage.getItem('accessToken') ? this.generateAccessToken() : '';
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  // generate access token
  public generateAccessToken(){
    this.accessTokenService.generateAccessToken().subscribe((response)=>{
      // set access token & expired at date
      const setDataObj = {
        access_token: response.access_token,
        expires_in: response.expires_in
      };
      StorageService.setAccessToken(setDataObj);
    }, (err) =>{
      console.log(err);
    });
  }

  // scroll to bottom
  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { 
      console.log(err);
    }
  }

  // send text message
  public sendMessage(message) {
    if (message.length != 0) {
      this.messageList.push({
        text: message,
        isOwner: true
      });
      this.message = '';
      this.detectIntent(message);
    }
  }
  
  // to detect intent for text message : (it will pass text input & retrive response text from dialogflow agent)
  private async detectIntent(message: string) {
    // check access token is valid or not , if not then generate new one.
    this.accessTokenService.checkAccessTokenValid().then((res)=>{
      if(res){
        this.dialogflowService.detectIntent(this.getSessionId(), message).subscribe(response => {
          this.playText(response['outputAudio']);
          this.messageList.push({
            text: response['queryResult']['fulfillmentText'],
            isOwner: false
          });
        });
      }
    });
  }

  // play response text from agent as audio
  private playText(encodedAudio) {
    const audio = new Audio("data:audio/wav;base64," + encodedAudio);
    audio.play();
  }

  // to get unique session id for each conversation between dialogflow agent & user.
  private getSessionId(): string {
    return StorageService.getSessionToken();
  }

  // start audio recording
  public startRecording() {
    this.audioRecordingService.startRecording();
  }

  // stop audio recording
  public async stopRecording() {
    this.audioRecordingService.stopRecording();
    this.recordedBlobSubscription = this.audioRecordingService.getRecordedBlob().subscribe(response => {
      const reader = new FileReader();
      reader.readAsDataURL(response.blob);
      reader.onloadend = () => {
        const base64 = reader.result.toString().split(',')[1];
        this.detectIntentFromAudio(base64);
      }
      this.recordedBlobSubscription.unsubscribe();
    });
  }

  // to detect intent from recorded audio message : (it will pass audio input & retrive response text from dialogflow agent)
  private async detectIntentFromAudio(audio) {
    // check access token is valid or not , if not then generate new one.
    this.accessTokenService.checkAccessTokenValid().then((res)=>{
      if(res){
        this.blobSubscription = this.dialogflowService.detectIntentFromAudio(this.getSessionId(), audio).subscribe((response) => {
          if(response['queryResult']['queryText'] !== undefined){
            this.playText(response['outputAudio']);
            this.messageList.push({
              text: response['queryResult']['queryText'],
              isOwner: true
            });
            this.messageList.push({
              text: response['queryResult']['fulfillmentText'],
              isOwner: false
            });
          }
          this.blobSubscription.unsubscribe();
        });
      }
    });
  }

}
