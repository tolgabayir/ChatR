import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth/auth.service";
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authservice: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        let logged = this.authservice.isLoggedIn();

        if (logged) {

            return true;

        } else {
            this.router.navigate(["login"]);
            return false;
        }

    }
}