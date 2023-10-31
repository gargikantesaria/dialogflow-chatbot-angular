import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { catchError } from 'rxjs/operators';

import { Router } from "@angular/router";
import { Observable, throwError } from 'rxjs';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(
    private router: Router
  ) {
    console.log("intercepted request ... ");
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authReq = req;
    console.log("Sending request with new header now ...");

    //send the newly created request
    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        // onError
        console.log("err is", err);
        return throwError(err);
      }))
  }
}