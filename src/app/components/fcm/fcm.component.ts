import { Component, OnInit } from '@angular/core';
import { LocalService } from 'src/app/services/local/local.service';
import { environment } from "src/environments/environment";
import { initializeApp } from 'firebase/app';
import { NotificationPayload, getMessaging, getToken, onMessage } from "firebase/messaging";

@Component({
    selector: 'fcm',
    templateUrl: './fcm.component.html',
    styleUrls: ['./fcm.component.scss']
})
export class FcmComponent implements OnInit {
    message: any = null;
    constructor(
        private localService: LocalService
    ) { }

    ngOnInit() {
        this.localService.getData("accessToken");
        this.requestPermission();
        this.listen();


    }



    requestPermission() {
        const app = initializeApp(environment.firebase);
        const messaging = getMessaging(app);

        getToken(messaging,
            { vapidKey: environment.firebase.vapidKey }).then(
                (currentToken) => {
                    if (currentToken) {
                        console.log(currentToken);
                        //Save device token to local. Then request to server with this token.
                        this.localService.saveData("deviceToken", currentToken);
                    } else {
                        console.log('No registration token available. Request permission to generate one.');

                    }
                }).catch((err) => {
                    console.log('An error occurred while retrieving token. ', err);
                });
    }
    listen() {
        const app = initializeApp(environment.firebase);
        const messaging = getMessaging(app);
        onMessage(messaging, (payload) => {
            console.log('Message received. ', payload);
            this.message = payload.notification;
            this.sendNotification();
        });


    }



    sendNotification() {

        // Tarayıcı bildirimine dönüştürülecek veriler
        const title = this.message.title; // Bildirim başlığı
        const options = {
            body: this.message.body,
            // Opsiyonel: Bildirim simgesi
        };

        // Tarayıcı bildirimini oluştur
        const notification = new Notification(title, options);
        console.log(notification.body);
        // Bildirim tıklanınca ne yapılacağını belirleyebilirsiniz
        notification.onclick = function () {
            // Bildirime tıklandığında yapılacak işlemleri burada tanımlayabilirsiniz.
        };


    }


    closeNotification() { }
}
