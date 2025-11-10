import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private baseUrl = "http://localhost:3000/api/auth";

  constructor(private http: HttpClient) {}

  // Login: ritorna accessToken e username
  login(email: string, password: string): Observable<{ accessToken: string; username: string }> {
    return this.http
      .post<{ accessToken: string; username: string }>(
        `${this.baseUrl}/login`,
        { email, password },
        { withCredentials: true } // necessario per cookie HTTP-only
      )
      .pipe(
        tap((res) => {
          localStorage.setItem("accessToken", res.accessToken);
          localStorage.setItem("username", res.username);
        })
      );
  }

  // Logout: pulisce storage
  logout() {
    console.log("Logging out user from the auth service.");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    // opzionale: chiamare backend per invalidare refresh token
  }

  // Rinnova accessToken usando refreshToken nel cookie
  refreshToken(): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string }>(`${this.baseUrl}/token`, {}, { withCredentials: true })
      .pipe(
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
