import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiService } from "../services/api.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private basePath = "auth";

  constructor(
    private router: Router,
    private api: ApiService,
  ) {}

  // Login: ritorna accessToken e username
  login(email: string, password: string): Observable<{ accessToken: string; username: string; email: string }> {
    console.log("Logging in through the URL: ", `${this.basePath}/login`);
    return this.api
      .post<{ accessToken: string; username: string; email: string }>(
        `${this.basePath}/login`,
        { email, password } // il withCredentials lo aggiunge ApiService
      )
      .pipe(
        tap((res) => {
          localStorage.setItem("accessToken", res.accessToken);
          localStorage.setItem("username", res.username);
          localStorage.setItem("email", res.email);
        })
      );
  }

  // Logout: pulisce storage
  logout() {
    console.log("Logging out user from the auth service.");
    localStorage.clear();
    this.router.navigate(["login"]);
  }

  // Rinnova accessToken usando refreshToken nel cookie
  refreshToken(): Observable<{ accessToken: string }> {
    return this.api.post<{ accessToken: string }>(`${this.basePath}/token`, {}).pipe(
      tap((res) => {
        localStorage.setItem("accessToken", res.accessToken);
      })
    );
  }

  // Controllo rapido se c'è accessToken
  getToken(): string | null {
    return localStorage.getItem("accessToken");
  }
}
