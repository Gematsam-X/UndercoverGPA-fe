import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faHome, faPlus, faArrowLeft, faChartBar } from "@fortawesome/free-solid-svg-icons";
import { AppHistoryService } from "../services/history.service";

@Component({
  selector: "page-core",
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: "./page-core.html",
  styleUrls: ["./page-core.css"],
})
export class PageCoreComponent {
  // Mostra o nasconde i pulsanti
  @Input() showHomeButton: boolean = true;
  @Input() showAddButton: boolean = true;
  @Input() showBackButton: boolean = true;
  @Input() showManageVotesButton: boolean = true;

  faHome = faHome;
  faPlus = faPlus;
  faBack = faArrowLeft;
  faManageVotes = faChartBar;

  constructor(private router: Router, private history: AppHistoryService) {}

  goHome() {
    this.router.navigate(["/home"]); // Torna alla home
  }

  addVote() {
    this.router.navigate(["/new-vote"]); // Vai alla pagina "aggiungi voto"
  }

  goBack() {
    const previousPath = this.history.goBack("/home");
    this.router.navigate([previousPath]);
  }

  goToManageVotes() {
    this.router.navigate(["/manage-votes"]); // Vai alla pagina "gestisci voti"
  }
}
