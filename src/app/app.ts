import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { AppHistoryService } from "./services/history.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: "./app.html",
  styleUrls: ["./app.css"],
})
export class App {
  protected readonly title = signal("UndercoverGPA");

  constructor(private router: Router, private historyService: AppHistoryService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.historyService.push(event.urlAfterRedirects);
      }
    });
  }
}
