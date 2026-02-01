import { Component, computed, signal, effect, input, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { ApiService } from "../services/api.service";
import { firstValueFrom } from "rxjs";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-average-widget",
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: "./average-widget.html",
  styleUrls: ["./average-widget.css"],
})
export class AverageWidget implements AfterViewInit {
  @ViewChild("subjectEl") subjectEl!: ElementRef<HTMLDivElement>;

  subject = input<string>("");
  votes = input<any[] | null>(null);

  private allVotes = signal<any[]>([]);
  private loadedFromServer = signal(false);
  isRefreshing = signal(false);

  faSync = faSync;

  constructor(private api: ApiService) {
    effect(() => {
      const incomingVotes = this.votes();
      if (Array.isArray(incomingVotes) && incomingVotes.length > 0) {
        this.allVotes.set(incomingVotes);
        this.loadedFromServer.set(false);
        return;
      }
      if (!this.loadedFromServer()) {
        this.loadFromServer();
      }
    });
  }

  ngAfterViewInit() {
    this.scaleTitle();
    window.addEventListener("resize", () => this.scaleTitle());
  }

  private scaleTitle() {
    if (!this.subjectEl) return;

    const el = this.subjectEl.nativeElement;
    const container = el.parentElement!; // avg-content

    let fontSize = 10; // partenza minima
    const maxFontSize = 25; // massimo consentito

    el.style.fontSize = fontSize + "px";
    el.style.whiteSpace = "nowrap";

    // scala fino a occupare larghezza o altezza massima
    while (
      el.scrollWidth <= container.clientWidth * 0.95 &&
      el.scrollHeight <= container.clientHeight * 0.25 &&
      fontSize < maxFontSize
    ) {
      fontSize++;
      el.style.fontSize = fontSize + "px";
    }
  }

  private async loadFromServer() {
    this.loadedFromServer.set(true);
    try {
      const serverVotes = await firstValueFrom(this.api.get<any[]>("votes"));
      this.allVotes.set(Array.isArray(serverVotes) ? serverVotes : []);
    } catch (err) {
      console.error("Errore caricamento voti dal server:", err);
      this.allVotes.set([]);
    }
  }

  async refreshVotes() {
    this.isRefreshing.set(true);
    try {
      const freshVotes = await firstValueFrom(this.api.get<any[]>("votes"));
      this.allVotes.set(Array.isArray(freshVotes) ? freshVotes : []);
    } catch (err) {
      console.error("Errore refresh voti:", err);
    } finally {
      this.isRefreshing.set(false);
    }
  }

  average = computed(() => {
    const all = this.allVotes();
    const subj = this.subject();
    const filtered = subj ? all.filter(v => v.subject === subj) : all;
    if (filtered.length === 0) return "ND";
    const sum = filtered.reduce((acc, v) => acc + (v.value ?? 0), 0);
    return (sum / filtered.length).toFixed(2);
  });
}
