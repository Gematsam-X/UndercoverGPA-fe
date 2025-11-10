import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { PageCoreComponent } from "../page-core/page-core";
import { AverageWidget } from "../average-widget/average-widget";

@Component({
  selector: "app-homepage",
  standalone: true,
  imports: [CommonModule, RouterModule, PageCoreComponent, AverageWidget],
  templateUrl: "./homepage.html",
  styleUrls: ["./homepage.css"],
})
export class Homepage {
  constructor(private router: Router) {}

  username = localStorage.getItem("username") || "utente";

  redirectToNewVoteForm() {
    this.router.navigate(["new-vote"]);
  }

  logout() {
    console.log("Logging out user.");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userEmail");
    this.router.navigate(["login"]);
  }
}
