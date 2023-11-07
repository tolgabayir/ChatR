import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, OnInit, ViewChild } from '@angular/core';
import { delay } from 'q';
import { UserDto } from 'src/app/models/Dto/UserDto';
import { Message } from 'src/app/models/Message';
import { MessageNotification } from 'src/app/models/MessageNotification';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { FcmService } from 'src/app/services/fcm/fcm.service';
import { LocalService } from 'src/app/services/local/local.service';
import { SignalrService } from 'src/app/services/signalr/signalr.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [DatePipe]
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollMe') scrollMe: ElementRef;
  errorMessage: string;
  messages: Message[] = [];
  users: UserDto[] = [];
  newMessage: string = '';
  selectedIndex: number;
  selectedUsername: string;
  message: Message = new Message();
  filteredMessages: Message[] = [];
  messageReceived = new EventEmitter<Message>();
  isMessageFromCurrentUser: boolean;
  currentUsername: string;
  currentUser: UserDto;
  loadCount: number = 1;
  loadSize: number = 20;
  userSelected: boolean = false;
  messageNotification: MessageNotification = new MessageNotification();
  showAlert: boolean = false;
  messageNotifications: MessageNotification[] = [];
  isCheckBoxesActive: boolean = false;
  isAllMessagesSelected: boolean = false;



  constructor(private signalrService: SignalrService,
    private authService: AuthService,
    private chatService: ChatService,
    private datePipe: DatePipe,
    private localService: LocalService,
    private fcmService: FcmService) {
    this.registerEvents();
    this.subscribeToEvents();
    this.currentUsername = authService.getCurrentUsername();

    if (this.authService.isLoggedIn) {
      this.getUsers();
      this.getMessagesByUsername();
    }

  }

  ngOnInit() { }

  //Listen received messages
  registerEvents(): void {

    this.signalrService.hubConnection.on('sendAsyncMessage', (message: Message) => {

      if (message.sender.userName != this.authService.getCurrentUsername()) {

        this.message = new Message();
        this.message.sender = message.sender;
        this.message.receiver = message.receiver;
        this.message.text = message.text;
        this.message.when = message.when;
        this.message.receiptInfo = message.receiptInfo;
        this.message.isDeleted = message.isDeleted;
        this.messageReceived.emit(this.message);
        const token = this.localService.getData("deviceToken");
        if (token) {

          this.fcmService.sendPushNotification(token, message.sender.userName, message.text).subscribe({
            next: (response) => {
              console.log("Push notification sent.");
            },
            error: (error) => {
              console.error("Push notification could not be sent", error);
            },
          });
        }
      }
    });
  }


  //Add Received Messages to Messages List and Create Notification
  subscribeToEvents(): void {
    this.messageReceived.subscribe((_message: Message) => {

      if (this.selectedUsername == _message.sender.userName) {
        _message.receiptInfo = true;
        this.messageNotification.unReadedMessage = 0;
      }
      else {

        const senderId = _message.sender.id;
        const receiverId = _message.receiver.id;
        const notifExist = this.messageNotifications.find(notification => {
          return notification.senderId === senderId && notification.receiverId === receiverId;
        })

        if (notifExist) {

          this.messageNotification.unReadedMessage++;

        } else {

          this.messageNotification = new MessageNotification();
          this.messageNotification.senderId = senderId;
          this.messageNotification.receiverId = receiverId;
          this.messageNotification.unReadedMessage = 1;

          this.messageNotifications.push(this.messageNotification);
        }
      }

      this.messages.push(_message);
      this.scrollToBottom();

    })
  }


  //Messages Lazy Loading
  @HostListener('scroll', ['$event'])
  async onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const scrollPosition = element.scrollTop;
    if (scrollPosition === 0) {
      //Fetching new messages
      this.showAlert = true;
      await delay(1000);
      this.getMessagesByUsername();
      this.showAlert = false;
    }
  }


  getMessagesByUsername() {
    this.chatService.getMessages(this.currentUsername, this.loadCount, this.loadSize).subscribe({
      next: (response): Message[] | any => {

        for (let index = 0; index < response.length; index++) {
          this.message = new Message();
          this.message.id = response[index].id;
          this.message.sender = this.users.find(u => u.id == response[index].senderId);
          this.message.receiver = this.users.find(u => u.id == response[index].receiverId);
          this.message.text = response[index].text;
          this.message.when = response[index].when;
          this.message.receiptInfo = response[index].receiptInfo;
          this.message.isDeleted = response[index].isDeleted;

          this.messages.unshift(this.message);
        }
        //For Pagination
        this.loadCount++;

      },
      error: (error) => {
      },
    })
  }


  getUsers() {
    this.authService.getUsers().subscribe({
      next: (response): UserDto | any => {
        this.users = response;
        this.currentUser = this.users.find(u => u.userName == this.currentUsername);
      },
      error: (error) => {
      },
    })
  }


  isUserActive(index: number) {
    if (index == this.selectedIndex) {
      return true;
    }
  }



  selectUser(userIndex: number, userName: string) {
    this.selectedIndex = userIndex;
    this.selectedUsername = userName;
    var selectedUser = this.users.find(u => u.userName == this.selectedUsername);
    var activeUserNotif = this.messageNotifications.find(notif => notif.senderId == selectedUser.id);

    if (activeUserNotif) {
      activeUserNotif.unReadedMessage = 0;
    }
  }



  filterMessagesByUser() {

    this.filteredMessages = this.messages.filter(m => m.sender.userName == this.currentUsername
      && m.receiver.userName == this.selectedUsername || m.sender.userName == this.selectedUsername
      && m.receiver.userName == this.currentUsername);
    return this.filteredMessages;
  }


  sendMessage() {
    this.message = new Message();
    this.message.sender = this.users.find(user => user.userName == this.currentUsername),
      this.message.receiver = this.users.find(user => user.userName == this.selectedUsername),
      this.message.text = this.newMessage,
      this.message.when = this.datePipe.transform(Date.now(), "yyyy-MM-dd HH:mm:ss");
    this.message.receiptInfo = false,
      this.message.isDeleted = false
    this.messages.push(this.message);
    this.scrollToBottom();
    this.signalrService.hubConnection.invoke('SendChatMessage', this.message);
    this.saveMessage(this.message);

    this.newMessage = "";
  }



  saveMessage(message: Message) {
    this.chatService.saveMessage(message).subscribe({
      next(value) {
        console.log(value);
      },
      error(err) {
      },
    });
  }

  chooseMessages() {
    this.isCheckBoxesActive = !this.isCheckBoxesActive;
  }

  onEnterPress(event: any) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.newMessage.trim() !== '' && this.selectedUsername !== null) {
        this.sendMessage();
      }
    }
  }


  scrollToBottom() {
    this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight;
  }


  getMessageStyle(message: any) {
    return {
      'flex': this.isCheckBoxesActive ? '1 1 70%' : '1',
      'margin-left': this.isCheckBoxesActive ? '10px' : '0',
      'background-color': 'white',
      'border-radius': '8px',
      'text-align': message.sender.userName == this.currentUsername ? 'right' : 'left',
    };
  }

  selectAllMessages() {
    this.isAllMessagesSelected = !this.isAllMessagesSelected;

    this.filteredMessages.forEach((message) => {
      message.isChecked = this.isAllMessagesSelected;

    });

  }

  selectMessage(message) {

    message.isChecked = !message.isChecked;
  }

  deleteMessage() {

    var messages = this.messages.filter(c => c.isChecked === true);
    var messageIds = messages.map(m => m.id);

    if (messages && messages.length === 1) {
      const mesId = messageIds[0];
      const index = this.messages.findIndex(message => message.id === mesId);
      if (index !== -1) {
        this.messages.splice(index, 1); //Remove message from list.
      }

      this.chatService.deleteMessage(mesId).subscribe(
        {
          next: (response) => { },
          error: (err) => {
            console.log("Error: " + err);
          },
        }
      );


    }
    else {
      const deletedMessages = [];
      for (const message of messages) {
        const index = this.messages.findIndex(mes => mes.id === message.id);
        if (index !== -1) {
          this.messages.splice(index, 1); //Remove message from list.
        }
        deletedMessages.push(message);

      }
      if (deletedMessages.length != 0) {
        this.chatService.deleteMessages(messageIds).subscribe(
          {
            next: (response) => {


            },
            error: (err) => {
              console.log("Error: " + err);
            },
          }
        );
      }
    }

  }
}


