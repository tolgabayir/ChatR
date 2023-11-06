import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from 'src/app/models/Dto/UserDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URL: string = environment.API_ENDPOINT + "Auth/";
  LOGIN: string = "login";
  REGISTER: string = "register";
  USERS: string = "users";
  content = "MySuperSecureKey";
  username: string;
  user: UserDto;

  headers = new HttpHeaders({
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,OPTIONS,DELETE',
  });

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(this.API_URL + this.LOGIN, body, { headers: this.headers });

  }

  register(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(this.API_URL + this.REGISTER, body);
  }

  isLoggedIn() {
    const token = localStorage.getItem("accessToken");
    return !!token;
  }

  getUsers(): Observable<UserDto[]> {

    return this.http.get<UserDto[]>(this.API_URL + this.USERS);
  }
  setCurrentUsername(username: string) {
    this.username = username;
  }

  getCurrentUsername() {
    return this.username;
  }

}
