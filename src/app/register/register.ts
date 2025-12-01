// src/app/register/register.ts
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./register.html",
})
export class Register {
  email = localStorage.getItem("userEmail") || ""; // prende l'email da localStorage
  password = "";
  username = "";

  constructor(private api: ApiService, private router: Router) {}

  onSubmit() {
    if (!this.email) return alert("Email mancante!");

    this.api
      .post("auth/register", {
        email: this.email,
        password: this.password,
        username: this.username,
      })
      .subscribe({
        next: () => {
          alert("Registrazione completata!");
          this.router.navigate(["login"]);
        },
        error: (err) => {
          console.error(err);
          alert("Errore server!");
        },
      });
  }
}
