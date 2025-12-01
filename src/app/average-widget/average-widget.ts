import { CommonModule } from "@angular/common";
import { Component, computed, signal, OnInit, input } from "@angular/core";
import { IndexedDBStorageService } from "../services/indexeddb-storage.service";
import { ApiService } from "../services/api.service";
import { firstValueFrom } from "rxjs";
// Font Awesome
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";

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
export class AverageWidget implements OnInit {
  private allVotes = signal<Vote[]>([]);
  subject = input<string>("");
  isRefreshing = signal(false);

  faSync = faSyncAlt; // 🔹 icona Font Awesome

  constructor(private db: IndexedDBStorageService, private api: ApiService) {}

  async ngOnInit() {
    await this.loadVotes();
  }

  private async loadVotes() {
    try {
      let storedVotes = await this.db.getItem<Vote[]>("votes");

      if (!Array.isArray(storedVotes) || storedVotes.length === 0) {
        storedVotes = await firstValueFrom(this.api.get<Vote[]>("votes"));
        await this.db.setItem("votes", storedVotes);
      }

      this.allVotes.set(Array.isArray(storedVotes) ? storedVotes : []);
    } catch (err) {
      console.error("Errore durante il caricamento dei voti:", err);
      this.allVotes.set([]);
    }
  }

  async refreshVotes() {
    this.isRefreshing.set(true); // 🔹 inizio loader
    try {
      const freshVotes = await firstValueFrom(
        this.api.get<Vote[]>("votes")
      );

      if (Array.isArray(freshVotes)) {
        this.allVotes.set(freshVotes);
        await this.db.setItem("votes", freshVotes);
        console.log("Voti aggiornati con successo dal server!");
      }
    } catch (err) {
      console.error("Errore durante il refresh dei voti:", err);
    } finally {
      this.isRefreshing.set(false); // 🔹 fine loader
    }
  }

  // 🔹 Calcolo della media (filtrando se serve)
  average = computed(() => {
    const all = this.allVotes() || [];
    const subj = this.subject() || "";

    const filtered = subj ? all.filter((v) => v.subject === subj) : all;

    if (!Array.isArray(filtered) || filtered.length === 0) return "ND";

    const sum = filtered.reduce((acc, v) => acc + (v.value ?? 0), 0);
    return (sum / filtered.length).toFixed(2);
  });

  // 🔹 Lista dei voti filtrati
  filteredVotes = computed(() => {
    const subj = this.subject() || "";
    const all = this.allVotes() || [];
    return Array.isArray(all) ? (subj ? all.filter((v) => v.subject === subj) : all) : [];
  });
}
