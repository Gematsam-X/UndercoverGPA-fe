import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OfflineService } from "../services/offline.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-offline-modal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./offline-modal.html",
  styleUrls: ["./offline-modal.css"],
})
export class OfflineModalComponent {
  visible$: Observable<boolean>;

  constructor(private offlineService: OfflineService) {
    this.visible$ = this.offlineService.isVisible$;
  }
}
