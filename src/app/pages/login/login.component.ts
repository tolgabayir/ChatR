import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LocalService } from 'src/app/services/local/local.service';
import { UserDto } from 'src/app/models/Dto/UserDto';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  errorMessage: string = "";
  user: UserDto;
  constructor(private authService: AuthService,
    private router: Router,
    private localService: LocalService,

  ) { }

  ngOnInit(): void {
    this.authService.setCurrentUsername("");
    this.localService.clearData();
  }


  login() {
    this.authService.login(this.username, this.password).subscribe(
      {
        next: (response): any => {
          this.authService.setCurrentUsername(this.username);

          this.localService.saveData("accessToken", response.token);
          this.localService.saveData("username", this.username);
          this.router.navigateByUrl("/dashboard");

        },
        error: (error) => {
          this.errorMessage = "Invalid Username or Password";
        }
      }
    )
  }

}
