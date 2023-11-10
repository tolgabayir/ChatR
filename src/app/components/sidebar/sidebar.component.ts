import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat/chat.service';
import { FcmService } from 'src/app/services/fcm/fcm.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'fa fa-home text-primary', class: '' },
  { path: '/logout', title: 'Logout', icon: 'fa fa-user-times text-info', class: '' },

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  public isSettingsMenuOpen: boolean = false;
  public isNotificationsAllowed: boolean = false;
  public isProfilePictureHide: boolean = false;
  public isNotificationContentHide: boolean = false;

  constructor(private router: Router, private fcmService: FcmService, private chatService: ChatService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  toggleSettingsMenu() {
    this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
  }

  hideProfilePicture() {
    this.chatService.isProfilePictureHidden = this.isProfilePictureHide;
  }

  allowNotifications() {
    this.fcmService.isNotificationAllowed = this.isNotificationsAllowed;
  }

  hideNotificationContent() {
    this.fcmService.isNotificationContentHide = this.isNotificationContentHide;
  }
}
