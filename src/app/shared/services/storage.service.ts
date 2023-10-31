import { Injectable } from '@angular/core';
import * as uuid from "uuid";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // to get unique session id for each conversation between dialogflow agent & user.
  static getSessionToken() {
    let sessionId: string;

    if (sessionStorage.getItem('sessionId')) {
      sessionId = sessionStorage.getItem('sessionId');
    } else {
      sessionId = uuid.v4();
      sessionStorage.setItem('sessionId', sessionId);
    }

    return sessionId;
  }

  // set access token
  static setAccessToken(data: { access_token: string , expires_in: number }) {
    // set access token
    sessionStorage.setItem('accessToken', data.access_token);
    // set token expires at (in date)
    sessionStorage.setItem('expiresAt', new Date(new Date().setSeconds(new Date().getSeconds() + data.expires_in)).toLocaleString());
  }
}
