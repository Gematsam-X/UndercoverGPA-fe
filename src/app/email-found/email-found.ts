// src/app/email-found/email-found.ts
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: "app-email-found",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./email-found.html",
})
export class EmailFound implements OnInit {
  email = localStorage.getItem("userEmail") || ""; // prende l'email da localStorage
  password = "";

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    if (!this.email) {
      alert("Email non trovata, torna al login!");
      this.router.navigate(["login"]);
    }
  }

  onLogin() {
    if (!this.password) return alert("Inserisci la password!");

    // chiama il backend per login con JWT
    this.http
      .post<{
        message: string;
        accessToken: string;
        username: string;
      }>(
        "http://localhost:3000/api/auth/login",
        {
          email: this.email,
          password: this.password,
        },
        { withCredentials: true }
      )
      .subscribe({
        next: (res) => {
          // Salviamo
          localStorage.setItem("accessToken", res.accessToken);
          localStorage.setItem("username", res.username);

          alert(res.message + " 👌 Benvenuto " + res.username);

          // Redirect a home
          this.router.navigate(["home"]);
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.error || "Errore server o credenziali errate!");
        },
      });
  }
}
