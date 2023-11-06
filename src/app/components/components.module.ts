import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChatComponent } from './chat/chat.component';
import { FormsModule } from '@angular/forms';
import { FcmComponent } from './fcm/fcm.component';
import { ToastrModule } from 'ngx-toastr'
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ToastrModule.forRoot()

  ],
  declarations: [
    NavbarComponent,
    SidebarComponent,
    ChatComponent,
    FcmComponent

  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    ChatComponent,
    FcmComponent
  ]
})
export class ComponentsModule { }
