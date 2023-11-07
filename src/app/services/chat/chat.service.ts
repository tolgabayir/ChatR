import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, tap } from 'rxjs';
import { Message } from 'src/app/models/Message';
import { environment } from 'src/environments/environment';
import { LocalService } from '../local/local.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  API_URL: string = environment.API_ENDPOINT + "Chat/";
  content = "MySuperSecureKey";
  MESSAGES: string = "messages";
  MESSAGE: string = "message";

  DELETE_MESSAGE_BY_ID: string = "deleteMessageById";
  DELETE_MESSAGES_BY_ID: string = "deleteMessagesById";
  UPDATE_MESSAGE_BY_ID: string = "updateMessageById";
  UPDATE_MESSAGES_BY_ID: string = "updateMessagesById";


  constructor(private http: HttpClient, private localService: LocalService) { }


  sendAuthorizedRequest() {
    const token = this.localService.getData('accessToken');
    if (token) {
      const headers = new HttpHeaders({
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,OPTIONS,DELETE',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      return headers;
    }
  }

  getMessages(username: string, loadNumber: number, loadSize: number): Observable<any> {
    var headers = this.sendAuthorizedRequest();
    const body = { username, loadNumber, loadSize }
    return this.http.post(this.API_URL + this.MESSAGES, body, { headers: headers });
  }

  saveMessage(message: Message): Observable<any> {

    var headers = this.sendAuthorizedRequest();
    return this.http.post(this.API_URL + this.MESSAGE, message, { headers: headers });

  }

  deleteMessage(messageId: string): Observable<any> {
    const body = { messageId: messageId };
    var headers = this.sendAuthorizedRequest();
    return this.http.post(this.API_URL + this.DELETE_MESSAGE_BY_ID, body, { headers: headers });

  }

  deleteMessages(messageIds: string[]): Observable<any> {

    var headers = this.sendAuthorizedRequest();
    return this.http.post(this.API_URL + this.DELETE_MESSAGES_BY_ID, messageIds, { headers: headers });

  }

  updateMessage(message: Message): Observable<any> {

    var headers = this.sendAuthorizedRequest();
    return this.http.post(this.API_URL + this.UPDATE_MESSAGE_BY_ID, message, { headers: headers });

  }

  updateMessages(messageIds: string[]): Observable<any> {

    var headers = this.sendAuthorizedRequest();
    return this.http.post(this.API_URL + this.UPDATE_MESSAGES_BY_ID, messageIds, { headers: headers });

  }


}
