import { Component, OnInit, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PageCoreComponent } from "../page-core/page-core";
import { AverageWidget } from "../average-widget/average-widget";
import { ApiService } from "../services/api.service";

// Rappresenta un singolo voto restituito dall'API
interface Vote {
  value: number;      // valore del voto
  subject: string;    // materia (es. Matematica, Italiano)
  label: string;      // etichetta / descrizione
  createdAt: string;  // data di creazione (ISO string dall'API)
  userID: string;     // ID dell'utente che ha inserito il voto
}

@Component({
  selector: "app-individual-averages",
  standalone: true,
  imports: [
    CommonModule,
    PageCoreComponent,
    AverageWidget
  ],
  templateUrl: "./individual-averages.html",
  styleUrl: "./individual-averages.css",
})
export class IndividualAverages implements OnInit {

  /**
   * Stato principale del componente:
   * contiene tutti i voti caricati dal backend.
   * È un signal, quindi ogni modifica notifica automaticamente la UI.
   */
  votes = signal<Vote[]>([]);

  /**
   * Stato derivato:
   * calcola dinamicamente l'elenco delle materie
   * partendo dai voti presenti.
   * Si ricalcola SOLO quando cambia "votes".
   */
  subjects = computed(() => {
    const subjectList = this.votes().map(vote => vote.subject);
    return Array.from(new Set(subjectList));
  });

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.get<Vote[]>("votes").subscribe({
      next: (votes) => {
        // Aggiorna lo stato reattivo
        this.votes.set(votes);
      },
      error: (err) => {
        console.error("Errore nel recupero dei voti", err);
      },
    });
  }
}
