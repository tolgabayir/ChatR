import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LocalService } from 'src/app/services/local/local.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: User;
  username: string;
  password: string;
  email: string;
  errorMessage: string;

  constructor(private authService: AuthService, private router: Router, private localService: LocalService) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.username, this.password).subscribe(
      {
        next: (response): any => {
          this.user = new User();
          this.user.username = this.username;
          this.user.token = response.token;
          this.user.tokenExpDate = response.expiration;
          this.localService.saveData(this.user.username, this.user);

          this.router.navigateByUrl("/dashboard");
        },
        error: (error) => {
          this.errorMessage = "Invalid Information!";
        }
      }
    )
  }

}
