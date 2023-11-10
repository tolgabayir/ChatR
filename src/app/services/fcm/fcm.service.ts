import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalService } from '../local/local.service';
@Injectable({
  providedIn: 'root'
})
export class FcmService {
  API_URL: string = environment.API_ENDPOINT + "Fcm/";
  SEND_NOTIFICATION: string = "sendNotification";
  isNotificationAllowed: boolean = false;

  isNotificationContentHide: boolean = false;

  headers = new HttpHeaders({
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,OPTIONS,DELETE',
  });

  constructor(private http: HttpClient, private localService: LocalService, private fcmService: FcmService) { }


  sendPushNotification(deviceToken: string, title: string, body: string): Observable<any> {

    const req = { deviceToken, title, body };
    return this.http.post(this.API_URL + this.SEND_NOTIFICATION, req, { headers: this.headers });


  }


}
