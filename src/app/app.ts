import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { AppHistoryService } from "./services/history.service";
import { ConnectingServer } from "./connecting-server/connecting-server";
import { ConnectingServerService } from "./services/connecting-server.service";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterModule, FormsModule, ConnectingServer, AsyncPipe],
  templateUrl: "./app.html",
  styleUrls: ["./app.css"],
})
export class App {
  protected readonly title = signal("UndercoverGPA");
  constructor(private router: Router, private historyService: AppHistoryService, public connectingServerService: ConnectingServerService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.historyService.push(event.urlAfterRedirects);
      }
    });
  }
}
