import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { firstValueFrom } from "rxjs";
import { IndexedDBStorageService } from "../services/indexeddb-storage.service";
import { ApiService } from "../services/api.service";
import { PageCoreComponent } from "../page-core/page-core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faEdit, faSync, faTrash } from "@fortawesome/free-solid-svg-icons";

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

  // Modifica voto
  editingVote: Vote | null = null;

  deleteVoteText: string = "Vuoi davvero eliminare questo voto?";
  isDeleting: boolean = false;

  isRefreshingVotes: boolean = false;

  refreshIcon = faSync;
  editIcon = faEdit;
  deleteIcon = faTrash;

  constructor(private dbService: IndexedDBStorageService, private api: ApiService) {}

  async ngOnInit() {
    await this.loadVotes();
  }

  async loadVotes() {
    const storedVotes =
      (await firstValueFrom(this.api.get<Vote[]>("votes"))) ||
      (await this.dbService.getItem<Vote[]>("votes"));
    this.votes = storedVotes || [];
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
    this.editingVote = JSON.parse(JSON.stringify(v));
  }

  cancelEdit() {
    this.editingVote = null;
  }

  async saveEditedVote() {
    if (!this.editingVote || !this.editingVote._id) return;

    const idx = this.votes.findIndex((v) => v._id === this.editingVote!._id);
    if (idx !== -1) {
      this.votes[idx] = { ...this.editingVote };
      await this.dbService.setItem("votes", this.votes);
    }

    this.editingVote = null;
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
