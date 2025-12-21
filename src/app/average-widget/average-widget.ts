import { CommonModule } from "@angular/common";
import { Component, computed, signal, effect, input } from "@angular/core";
import { ApiService } from "../services/api.service";
import { firstValueFrom } from "rxjs";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

interface Vote {
  subject: string;
  label: string;
  value: number;
  createdAt: string;
  userID: string;
}

@Component({
  selector: "app-average-widget",
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: "./average-widget.html",
  styleUrls: ["./average-widget.css"],
})
export class AverageWidget {
  // 🔹 INPUT OPZIONALI
  subject = input<string>("");
  votes = input<Vote[] | null>(null);

  // 🔹 STATO INTERNO
  private allVotes = signal<Vote[]>([]);
  private loadedFromServer = signal(false);
  isRefreshing = signal(false);

  faSync = faSync;

  constructor(private api: ApiService) {
    effect(() => {
      const incomingVotes = this.votes();

      // 1️⃣ Se il parent passa i voti → hanno precedenza
      if (Array.isArray(incomingVotes) && incomingVotes.length > 0) {
        this.allVotes.set(incomingVotes);
        this.loadedFromServer.set(false); // reset logico
        return;
      }

      // 2️⃣ Se NON arrivano voti e NON ho ancora caricato dal server → fetch
      if (!this.loadedFromServer()) {
        this.loadFromServer();
      }
    });
  }

  // 🔹 caricamento iniziale server
  private async loadFromServer() {
    this.loadedFromServer.set(true);

    try {
      const serverVotes = await firstValueFrom(
        this.api.get<Vote[]>("votes")
      );

      this.allVotes.set(Array.isArray(serverVotes) ? serverVotes : []);
    } catch (err) {
      console.error("Errore caricamento voti dal server:", err);
      this.allVotes.set([]);
    }
  }

  // 🔹 refresh manuale
  async refreshVotes() {
    this.isRefreshing.set(true);
    try {
      const freshVotes = await firstValueFrom(
        this.api.get<Vote[]>("votes")
      );
      this.allVotes.set(Array.isArray(freshVotes) ? freshVotes : []);
    } catch (err) {
      console.error("Errore refresh voti:", err);
    } finally {
      this.isRefreshing.set(false);
    }
  }

  // 🔹 media per materia
  average = computed(() => {
    const all = this.allVotes();
    const subj = this.subject();

    const filtered = subj
      ? all.filter(v => v.subject === subj)
      : all;

    if (filtered.length === 0) return "ND";

    const sum = filtered.reduce((acc, v) => acc + (v.value ?? 0), 0);
    return (sum / filtered.length).toFixed(2);
  });

  // 🔹 voti filtrati
  filteredVotes = computed(() => {
    const subj = this.subject();
    const all = this.allVotes();
    return subj ? all.filter(v => v.subject === subj) : all;
  });
}
