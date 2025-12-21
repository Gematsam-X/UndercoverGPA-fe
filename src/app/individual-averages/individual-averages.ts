import { Component, OnInit, signal, Signal, computed } from "@angular/core";
import { PageCoreComponent } from "../page-core/page-core";
import { ApiService } from "../services/api.service";
import { AverageWidget } from "../average-widget/average-widget";
import { CommonModule } from "@angular/common";

interface Vote {
  value: number;
  subject: string;
  label: string;
  createdAt: string;
  userID: string;
}

@Component({
  selector: "app-individual-averages",
  standalone: true,
  imports: [CommonModule, PageCoreComponent, AverageWidget],
  templateUrl: "./individual-averages.html",
  styleUrl: "./individual-averages.css",
})
export class IndividualAverages implements OnInit {
  // 🔹 stato principale
  votes = signal<Vote[]>([]);

  // 🔹 stato derivato (reattivo!)
  subjects = computed(() =>
    Array.from(new Set(this.votes().map(v => v.subject)))
  );

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<Vote[]>("votes").subscribe({
      next: (votes) => {
        this.votes.set(votes);
      },
      error: (err) => {
        console.error("Errore nel recupero voti", err);
      },
    });
  }
}
