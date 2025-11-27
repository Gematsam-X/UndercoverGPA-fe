import { Component, OnInit } from "@angular/core";
import { IndexedDBStorageService } from "../services/indexeddb-storage.service";

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
  templateUrl: "./manage-votes.html",
})
export class ManageVotesComponent implements OnInit {
  votes: Vote[] = [];

  constructor(private dbService: IndexedDBStorageService) {}

  async ngOnInit() {
    await this.loadVotes();
  }

  async loadVotes() {
    const storedVotes = await this.dbService.getItem<Vote[]>("votes");
    this.votes = storedVotes || [];
  }

  async deleteVote(id: number) {
    this.votes = this.votes.filter((v) => v._id !== id);
    await this.dbService.setItem("votes", this.votes);
  }

  editVote(id: number) {
    console.log("Modifica voto:", id);
    // qui richiami il componente/modale per modificare
  }

  async syncWithMongo() {
    try {
      const response = await fetch("http://localhost:3000/api/votes", {
        method: "GET",
        credentials: "include", // qui si mette il "withCredentials: true"
      });
      const remoteVotes: Vote[] = await response.json();
      await this.dbService.setItem("votes", remoteVotes);
      await this.loadVotes();
    } catch (err) {
      console.error("Errore sincronizzazione:", err);
    }
  }
}
