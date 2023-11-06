import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { LocalService } from '../local/local.service';
@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  public hubConnection: signalR.HubConnection | undefined;

  constructor(private localService: LocalService) {
    this.initializeConnection();
  }

  private async initializeConnection() {

    const hubUrl = 'https://localhost:7269/chatHub';

    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(hubUrl, {

        accessTokenFactory: () => {

          var token = this.localService.getData("accessToken");
          return token;
        }
      })
      .build();

    try {
      await this.hubConnection.start();
      console.log('SignalR connection start.');
    } catch (err) {
      console.error('SignalR connection failed: ', err);
    }

  }







}

