import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DIALOGFLOW } from './api.config';
import { AccessTokenService } from './access-token.service';

@Injectable({
  providedIn: 'root'
})
export class DialogflowService {

  sessionId: string;


  constructor(private httpClient: HttpClient, private accessTokenService: AccessTokenService) {}

  // to detect intent from text message
  public detectIntent(sessionId: string, mesaage: string) {
    // check access token is valid or not , if not then generate new one.
    // this.accessTokenService.checkAccessTokenValid();

    // set header for dialogflow API request
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken'),
        'Content-Type': 'application/json; charset=utf-8',
      })
    };

    const payload = {
      query_input: {
        text: {
          text: mesaage,
          language_code: 'en'
        }
      },
      output_audio_config: {
        audio_encoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16',
        synthesizeSpeechConfig: {
          speakingRate: 1.2,
          voice: {
            ssmlGender: 'SSML_VOICE_GENDER_MALE'
          }
        }
      }
    }

    return this.httpClient.post(
      DIALOGFLOW.DETECT_AGENT.replace('{sessionId}', sessionId),
      payload,
      httpOptions
    );
  }

  // to detect intent from audio
  public detectIntentFromAudio(sessionId: string, audio: string) {
    // check access token is valid or not , if not then generate new one.
    // this.accessTokenService.checkAccessTokenValid();

    // set header for dialogflow API request
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken'),
        'Content-Type': 'application/json; charset=utf-8',
      })
    };

    const payload = {

      queryInput: {
        audioConfig: {
          languageCode: "en"
        }
      },
      inputAudio: audio,
      output_audio_config: {
        audio_encoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16',
        synthesizeSpeechConfig: {
          speakingRate: 1.2,
          voice: {
            ssmlGender: 'SSML_VOICE_GENDER_MALE'
          }
        }
      }
    }

    return this.httpClient.post(
      DIALOGFLOW.DETECT_AGENT.replace('{sessionId}', sessionId),
      payload,
      httpOptions
    );
  }
}
