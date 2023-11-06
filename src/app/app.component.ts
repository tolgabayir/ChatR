import { Component, OnInit } from '@angular/core';
import { LocalService } from './services/local/local.service';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ChatR';

  constructor(private localService: LocalService, private authService: AuthService, private router: Router) { }
  ngOnInit(): void {

    var token = this.localService.getData("accessToken");
    if (token) {
      var username = this.localService.getData("username");
      this.authService.setCurrentUsername(username);
      this.router.navigate(["dashboard"]);
    }
    else {
      this.router.navigate(["login"]);
    }
  }


}

