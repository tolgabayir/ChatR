import { Component, OnInit } from '@angular/core';
import { LocalService } from 'src/app/services/local/local.service';
import { environment } from "src/environments/environment";
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from "firebase/messaging";


@Component({
    selector: 'fcm',
    templateUrl: './fcm.component.html',
    styleUrls: ['./fcm.component.scss']
})

export class FcmComponent implements OnInit {
    message: any = null;
    isPushNotificationAllowed: boolean;


    constructor(
        private localService: LocalService,
    ) {

    }


    ngOnInit() {
        this.localService.getData("accessToken");
        this.requestPermission();

    }


    requestPermission() {
        const app = initializeApp(environment.firebase);
        const messaging = getMessaging(app);
        getToken(messaging,
            { vapidKey: environment.firebase.vapidKey }).then(
                (currentToken) => {
                    if (currentToken) {
                        //Save device token to local. Then request to server with this token.
                        this.localService.saveData("deviceToken", currentToken);
                    } else {
                        console.log('No registration token available. Request permission to generate one.');
                    }
                }).catch((err) => {
                    console.log('An error occurred while retrieving token. ', err);
                });
    }

}

