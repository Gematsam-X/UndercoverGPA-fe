import Swal from "sweetalert2";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { PageCoreComponent } from "../page-core/page-core";
import { AuthService } from "../services/auth.service";
import { ApiService } from "../services/api.service";
import {
  faCloudDownload,
  faCloudUpload,
  faRightFromBracket,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

interface VoteOption {
  _id: string;
  label: string;
  value: number;
  subject: string;
  examType: string;
  createdAt: string;
}

@Component({
  selector: "app-account-page",
  templateUrl: "./account-page.html",
  styleUrls: ["./account-page.css"],
  imports: [PageCoreComponent, FontAwesomeModule],
})
export class AccountPage {
  username: string | null = null;
  createBackupIcon = faCloudUpload;
  restoreBackupIcon = faCloudDownload;
  logoutIcon = faRightFromBracket;
  deleteAccountIcon = faUserSlash;

  votes: VoteOption[] = [];

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  /** Apri input file nascosto */
  triggerRestoreFileInput() {
    const input = document.querySelector<HTMLInputElement>('input[type="file"][hidden]');
    input?.click();
  }

  /** RIPRISTINO BACKUP DA FILE LOCALE */
  restoreBackup(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      let backupVotes: VoteOption[];
      try {
        backupVotes = JSON.parse(reader.result as string);
      } catch (err) {
        console.error("Errore nel parsing del backup:", err);
        Swal.fire("❌ Backup non valido", "", "error");
        return;
      }

      // Modale per scelta priorità merge
      const result = await Swal.fire({
        title: "Ripristina backup",
        text: "Come vuoi ripristinare i voti?",
        icon: "question",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Rimpiazza tutti i voti",
        denyButtonText: "Unisci (priorità backup)",
        cancelButtonText: "Unisci (priorità server)",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      if (result.isConfirmed) {
        // replace
        this.api
          .post("backup", {
            votes: backupVotes,
            priority: "replace",
          })
          .subscribe({
            next: (res) => {
              this.votes = [...backupVotes];
              Swal.fire("✅ Voti sostituiti!", "", "success");
            },
            error: (err) => {
              console.error("Errore ripristino backup:", err);
              Swal.fire("❌ Errore durante il ripristino del backup", "", "error");
            },
          });
      } else if (result.isDenied) {
        // merge backup+
        this.api
          .post("backup", {
            votes: backupVotes,
            priority: "backup",
          })
          .subscribe({
            next: (res) => {
              this.votes = this.mergeVotes(this.votes, backupVotes, "backup");
              Swal.fire("✅ Voti uniti (backup prioritario)!", "", "success");
            },
            error: (err) => {
              console.error("Errore merge backup:", err);
              Swal.fire("❌ Errore durante l'unione del backup", "", "error");
            },
          });
      } else {
        // merge server+
        this.api
          .post("backup", {
            votes: backupVotes,
            priority: "server",
          })
          .subscribe({
            next: (res) => {
              this.votes = this.mergeVotes(this.votes, backupVotes, "local");
              Swal.fire("✅ Voti uniti (voti server prioritari)!", "", "success");
            },
            error: (err) => {
              console.error("Errore merge backup:", err);
              Swal.fire("❌ Errore durante l'unione del backup", "", "error");
            },
          });
      }
    };

    reader.readAsText(file);
  }

  /** Funzione merge voti (client-side) */
  private mergeVotes(
    local: VoteOption[],
    backup: VoteOption[],
    priority: "local" | "backup"
  ): VoteOption[] {
    const mergedMap = new Map<string, VoteOption>();
    const first = priority === "backup" ? backup : local;
    const second = priority === "backup" ? local : backup;

    for (const v of first) mergedMap.set(v._id, v);
    for (const v of second) if (!mergedMap.has(v._id)) mergedMap.set(v._id, v);

    return Array.from(mergedMap.values());
  }

  /** LOGOUT */
  logout(): void {
    this.auth.logout();
  }

  /** ELIMINA ACCOUNT */
  deleteAccount(): void {
    if (!confirm("Questa azione eliminerà permanentemente il tuo account. Sei sicuro?")) return;
    this.api.delete("auth/user").subscribe({
      next: () => this.auth.logout(),
      error: (e) => console.error("Errore eliminazione account:", e),
    });
  }

  /** CREA BACKUP LOCALE O SERVER */
  createBackup(): void {
    this.api.get<VoteOption[]>("votes").subscribe({
      next: (votes) => {
        votes = Array.from(votes).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const dataStr = JSON.stringify(votes, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `backup_votes_${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      error: (e) => console.error("Errore creazione backup:", e),
    });
    console.log("Backup creato correttamente.");
  }

  /** NAVIGAZIONE HOME */
  goHome(): void {
    this.router.navigate(["homepage"]);
  }
}
