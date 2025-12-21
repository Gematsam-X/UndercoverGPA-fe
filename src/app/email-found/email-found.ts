// src/app/email-found/email-found.ts
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";
import { AuthService } from "../services/auth.service";
import { finalize } from "rxjs";

@Component({
  selector: "app-email-found",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./email-found.html",
})
export class EmailFound implements OnInit {
  email: string = localStorage.getItem("userEmail") || ""; // prende l'email da localStorage
  password: string = "";

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    if (!this.email) {
      alert("Email non trovata, torna al login!");
      this.router.navigate(["login"]);
    }
  }

  onLogin() {
    if (!this.password) return alert("Inserisci la password!");
    // chiama il backend per login
    this.auth
      .login(this.email, this.password)
      .pipe(
        finalize(() => {
          localStorage.removeItem("userEmail");
        })
      )
      .subscribe({
        next: (res) => {
          // Login riuscito, reindirizza a home
          this.router.navigate(["home"]);
        },
        error: (err) => {
          console.error(err);
          alert("Errore di login! Controlla le credenziali.");
        },
      });
  }
}
