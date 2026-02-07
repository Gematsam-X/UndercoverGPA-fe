import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { PageCoreComponent } from "../page-core/page-core";
import { AverageWidget } from "../average-widget/average-widget";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faBars, faChartColumn, faUser } from "@fortawesome/free-solid-svg-icons";
import { ThemeService } from "../services/theme.service";

@Component({
  selector: "app-homepage",
  standalone: true,
  imports: [CommonModule, RouterModule, PageCoreComponent, AverageWidget, FontAwesomeModule],
  templateUrl: "./homepage.html",
  styleUrls: ["./homepage.css"],
})
export class Homepage {
  drawerIcon = faBars;
  drawerOpen = false;
  accountIcon = faUser;

  individualAveragesIcon = faChartColumn;

  constructor(private router: Router, public theme: ThemeService) {}
  username = localStorage.getItem("username") || "utente";

  redirectToNewVoteForm() {
    this.router.navigate(["new-vote"]);
  }

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }

  onViewIndividualAverages() {
    this.router.navigate(["individual-averages"]);
  }

  toProfile() {
    this.router.navigate(["account-page"]);
  }
}
