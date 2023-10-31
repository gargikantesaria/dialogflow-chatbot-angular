import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenerateTokenInterface } from '../model/shared.model';
import { DIALOGFLOW } from './api.config';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AccessTokenService {

  constructor(private http: HttpClient) { }

  // to get access token
  public generateAccessToken(): Observable<GenerateTokenInterface>{
    return this.http.get<GenerateTokenInterface>(DIALOGFLOW.GENERATE_ACCESS_TOKEN);
  }

  // check access token is still valid or not
  public checkAccessTokenValid(){
    return new Promise((resolve, reject)=>{
      // generate new access token if not valid
      if(new Date().toLocaleString() > sessionStorage.getItem('expiresAt')){
        this.generateAccessToken().subscribe((response)=>{
          // set access token & expired at date
          const setDataObj = {
            access_token: response.access_token,
            expires_in: response.expires_in
          };
          StorageService.setAccessToken(setDataObj);
          resolve(true);
        },(err)=>{
          console.log(err);
          resolve(false);
          return err;
        });
      } else {
        resolve(true);
      }
    });
  }
}
