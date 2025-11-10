import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { PageCoreComponent } from "../page-core/page-core";

interface VoteOption {
  label: string;
  value: number;
}

@Component({
  selector: "app-new-vote",
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, PageCoreComponent],
  templateUrl: "./new-vote.html",
  styleUrls: ["./new-vote.css"],
})
export class NewVote {
  constructor(private http: HttpClient, private router: Router) {}

  // ===== voti =====
  votes: VoteOption[] = [
    { label: "4", value: 4 },
    { label: "4+", value: 4.25 },
    { label: "4½", value: 4.5 },
    { label: "5-", value: 4.75 },
    { label: "5", value: 5 },
    { label: "5+", value: 5.25 },
    { label: "5½", value: 5.5 },
    { label: "6-", value: 5.75 },
    { label: "6", value: 6 },
    { label: "6+", value: 6.25 },
    { label: "6½", value: 6.5 },
    { label: "7-", value: 6.75 },
    { label: "7", value: 7 },
    { label: "7+", value: 7.25 },
    { label: "7½", value: 7.5 },
    { label: "8-", value: 7.75 },
    { label: "8", value: 8 },
    { label: "8+", value: 8.25 },
    { label: "8½", value: 8.5 },
    { label: "9-", value: 8.75 },
    { label: "9", value: 9 },
    { label: "9+", value: 9.25 },
    { label: "9½", value: 9.5 },
    { label: "10-", value: 9.75 },
    { label: "10", value: 10 },
  ];

  selectedVote: VoteOption | null = null;
  customVote: number | null = null;

  // ===== materie =====
  subjects: string[] = [
    "Matematica",
    "Italiano",
    "Inglese",
    "Storia",
    "Geografia",
    "Fisica",
    "Chimica",
    "Tecnologia",
    "Arte",
    "Musica",
  ];
  selectedSubject: string | null = null; // dropdown
  customSubject: string | null = null; // input personalizzato

  // ===== tipo di prova =====
  selectedExamType: "scritta" | "pratica" | "orale" | null = null;

  // ===== UI state & messages =====
  voteMessage: string = "";
  voteMessageColor: string = "var(--primary-color)";
  isSubmitting = false;
  buttonLabel = "Invia voto";

  // ===== gestione dropdown / custom =====
  onDropdownChange() {
    this.customVote = null;
    this.voteMessage = "";
  }

  onCustomVoteChange() {
    this.selectedVote = null;
    this.voteMessage = "";
  }

  onSubjectChange() {
    this.customSubject = null;
    this.voteMessage = "";
  }

  onCustomSubjectChange() {
    this.selectedSubject = null;
    this.voteMessage = "";
  }

  // ===== reset totale form =====
  resetForm() {
    this.selectedVote = null;
    this.customVote = null;
    this.selectedSubject = null;
    this.customSubject = null;
    this.selectedExamType = null;
    this.voteMessage = "";
    this.voteMessageColor = "var(--primary-color)";
    this.buttonLabel = "Invia voto";
  }

  // ===== submit voto =====
  submitVote() {
    this.voteMessage = "";
    this.voteMessageColor = "var(--primary-color)";

    // ===== materia =====
    let subjectToSend: string | null = null;
    if (this.customSubject && this.customSubject.trim().length >= 2) {
      subjectToSend = this.customSubject.trim();
    } else if (this.selectedSubject) {
      subjectToSend = this.selectedSubject;
    } else {
      this.voteMessage = "⚠️ Devi scegliere una materia o inserirne una personalizzata.";
      this.voteMessageColor = "red";
      return;
    }

    // ===== tipo di prova =====
    if (!this.selectedExamType) {
      this.voteMessage = "⚠️ Seleziona il tipo di prova: scritta, pratica o orale.";
      this.voteMessageColor = "red";
      return;
    }

    // ===== voto =====
    let voteToSend: VoteOption | null = this.selectedVote;
    if (this.customVote !== null && this.customVote !== undefined) {
      if (this.customVote < 4 || this.customVote > 10) {
        this.voteMessage = "⚠️ Il voto personalizzato deve essere compreso tra 4 e 10!";
        this.voteMessageColor = "red";
        return;
      }
      const label = Number.isInteger(this.customVote)
        ? `${this.customVote}`
        : `${this.customVote}`.replace(/\.0+$/, "");
      voteToSend = { label, value: this.customVote };
    }

    if (!voteToSend) {
      this.voteMessage = "⚠️ Seleziona un voto o inseriscilo manualmente.";
      this.voteMessageColor = "red";
      return;
    }

    // ===== payload =====
    const payload = {
      label: voteToSend.label,
      value: voteToSend.value,
      subject: subjectToSend,
      examType: this.selectedExamType,
      createdAt: new Date().toISOString(),
    };

    // ===== invio =====
    this.isSubmitting = true;
    this.buttonLabel = "Invio in corso...";

    const token = localStorage.getItem("accessToken") || "";
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post("http://localhost:3000/api/votes", payload, { headers }).subscribe({
      next: () => {
        this.voteMessage = `✅ Voto "${payload.label}" per ${payload.subject} (${payload.examType}) inviato!`;
        this.voteMessageColor = "green";
        this.isSubmitting = false;

        // Cambia il pulsante per resettare al prossimo click
        this.buttonLabel = "Invia un altro voto";
      },
      error: (err) => {
        console.error("Errore invio voto:", err);
        this.voteMessage = "❌ Errore nell'invio del voto. Riprova più tardi.";
        this.voteMessageColor = "red";
        this.isSubmitting = false;
        this.buttonLabel = "Invia voto";
      },
    });
  }

  handleButtonClick() {
    if (this.buttonLabel === "Invia voto") {
      this.submitVote();
    } else if (this.buttonLabel === "Invia un altro voto") {
      this.resetForm();
    }
  }
}
