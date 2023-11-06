importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");
firebase.initializeApp({
    apiKey: "AIzaSyA3LxQIHHH3k-Lo6VHaOHaIiC413LATcNA",
    authDomain: "chatr-push-notification.firebaseapp.com",
    projectId: "chatr-push-notification",
    storageBucket: "chatr-push-notification.appspot.com",
    messagingSenderId: "1043001049569",
    appId: "1:1043001049569:web:37b84546b889e3e65052a0",
    vapidKey:"BJhUxl5bSN6r3BIXBc8ik_BTXsbHS916qp0bUgvjMdP-c_NWUnlvRaCg6JVeDtQDhM0nWR8hf4OYqgn-T43yKoE",
});
const messaging = firebase.messaging();

