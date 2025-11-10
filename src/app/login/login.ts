import { Component, signal, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from "@angular/common/http";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: "./login.html",
})
export class Login implements OnInit {
  email = ""; // Può indicare anche lo username

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    // 🔹 Se c'è un accessToken valido, rimanda subito a home
    const token = localStorage.getItem("accessToken");
    if (token) {
      this.router.navigate(["home"]);
    }
  }

  onSubmit() {
    if (!this.email) return alert("Inserisci un email o uno username!");

    // Salva subito l'email in localStorage
    localStorage.setItem("userEmail", this.email);

    // Chiama il backend per verificare se esiste
    this.http
      .get<{ exists: boolean }>(`http://localhost:3000/api/auth/check`, {
        params: { email: this.email },
      })
      .subscribe({
        next: (res) => {
          if (res.exists) {
            this.router.navigate(["email-found"]);
          } else {
            this.router.navigate(["register"]);
          }
        },
        error: (err) => {
          console.error(err);
          alert("Errore server!");
        },
      });
  }
}
