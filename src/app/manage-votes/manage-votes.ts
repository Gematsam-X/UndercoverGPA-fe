import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { firstValueFrom } from "rxjs";
import { IndexedDBStorageService } from "../services/indexeddb-storage.service";
import { ApiService } from "../services/api.service";
import { PageCoreComponent } from "../page-core/page-core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { Router } from "@angular/router";

interface Vote {
  _id?: number;
  userId?: string;
  label: string;
  value: number;
  subject: string;
  examType: string;
  createdAt: string;
}

@Component({
  selector: "app-manage-votes",
  standalone: true,
  imports: [CommonModule, FormsModule, PageCoreComponent, FontAwesomeModule],
  templateUrl: "./manage-votes.html",
  styleUrls: ["./manage-votes.css", "../../styles.css"],
})
export class ManageVotesComponent implements OnInit {
  votes: Vote[] = [];

  // Filtro
  filterText: string = "";

  // Conferma eliminazione
  confirmDeleteId: number | null | undefined = null;

  deleteVoteText: string = "Vuoi davvero eliminare questo voto?";
  isDeleting: boolean = false;

  isRefreshingVotes: boolean = false;

  refreshIcon = faSync;

  constructor(
    private dbService: IndexedDBStorageService,
    private api: ApiService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadVotes();
  }

  async loadVotes() {
    try {
      // 1️⃣ Prova a prendere i voti dal server
      const remoteVotes = await firstValueFrom(this.api.get<Vote[]>("votes")).catch(() => null);

      if (remoteVotes && Array.isArray(remoteVotes)) {
        this.votes = remoteVotes;
        await this.dbService.setItem("votes", remoteVotes); // salva in IndexedDB
        return;
      }

      // 2️⃣ Se il server fallisce, prendi dalla IndexedDB
      const storedVotes = await this.dbService.getItem<Vote[]>("votes").catch(() => null);

      // ✅ Forza sempre un array vuoto se null o non array
      this.votes = Array.isArray(storedVotes) ? storedVotes : [];
    } catch (err) {
      console.error("Errore caricamento voti:", err);
      this.votes = []; // fallback
    }
  }

  async deleteVote(id: number | undefined) {
    if (!id) return;
    this.isDeleting = true;
    try {
      this.deleteVoteText = "Eliminazione in corso...";

      // Chiedi al server di eliminare il voto
      await firstValueFrom(this.api.delete(`votes/${id}`));

      // Aggiorna la lista voti dal server
      const remoteVotes = await firstValueFrom(this.api.get<Vote[]>("votes"));
      this.votes = remoteVotes;

      // Aggiorna IndexedDB
      await this.dbService.setItem("votes", this.votes);

      // Alla fine chiudi la modale
      this.confirmDeleteId = null;
    } catch (err) {
      console.error("Errore eliminazione voto:", err);
      alert("Non è stato possibile eliminare il voto, riprova più tardi.");
    } finally {
      this.deleteVoteText = "Vuoi davvero eliminare questo voto?";
      this.isDeleting = false;
    }
  }

  editVote(id?: number) {
    if (id == null) return;
    const v = this.votes.find((el) => el._id === id);
    if (!v) return;

    // Clone profondo semplice
    sessionStorage.setItem("editingVote", JSON.stringify(v));
    this.router.navigate(["/new-vote"], { queryParams: { edit: "true" } });
  }

  async syncWithMongo() {
    this.isRefreshingVotes = true;
    try {
      const remoteVotes = await firstValueFrom(this.api.get<Vote[]>("votes"));
      await this.dbService.setItem("votes", remoteVotes);
      await this.loadVotes();
    } catch (err) {
      console.error("Errore sincronizzazione:", err);
    } finally {
      this.isRefreshingVotes = false;
    }
  }

  sortBy: "date" | "value" | "subject" | null = null; // criterio di ordinamento
  sortAsc: boolean = true; // crescente / decrescente

  // Getter che restituisce voti filtrati e ordinati
  get filteredVotes(): Vote[] {
    const text = this.filterText.toLowerCase();

    let result = this.votes.filter((v) => {
      const matchesText =
        v.label.toLowerCase().includes(text) ||
        v.subject.toLowerCase().includes(text) ||
        v.examType.toLowerCase().includes(text);

      return matchesText;
    });

    if (this.sortBy) {
      result = result.sort((a, b) => {
        let valA: any, valB: any;

        switch (this.sortBy) {
          case "date":
            valA = new Date(a.createdAt).getTime();
            valB = new Date(b.createdAt).getTime();
            break;
          case "value":
            valA = a.value;
            valB = b.value;
            break;
          case "subject":
            valA = a.subject.toLowerCase();
            valB = b.subject.toLowerCase();
            break;
        }

        if (valA < valB) return this.sortAsc ? -1 : 1;
        if (valA > valB) return this.sortAsc ? 1 : -1;
        return 0;
      });
    }

    return result;
  }

  getBubbleColor(v: number): string {
    if (v >= 4 && v <= 4.99) return "#ef4444D9";
    else if (v >= 4.99 && v <= 5.99) return "#facc15D9";
    else return "#22c55eD9";
  }

  // Funzione per cambiare ordinamento
  setSort(by: "date" | "value" | "subject") {
    if (this.sortBy === by) {
      this.sortAsc = !this.sortAsc; // inverti se clicchi di nuovo
    } else {
      this.sortBy = by;
      this.sortAsc = true;
    }
  }

  // trackBy per @for
  trackById(index: number, item: Vote) {
    return item._id ?? index;
  }
}
