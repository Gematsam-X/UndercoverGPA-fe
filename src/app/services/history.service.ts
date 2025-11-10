import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AppHistoryService {
  private stack: string[] = [];

  // Registra una pagina nella cronologia
  push(path: string) {
    const last = this.stack[this.stack.length - 1];
    const secondLast = this.stack[this.stack.length - 2];

    // Evita sequenze ripetitive tipo A-B-A-B
    if (path === last || path === secondLast) return;

    this.stack.push(path);
  }

  // Torna indietro evitando loop
  goBack(defaultPath: string = "/home"): string {
    if (this.stack.length === 0) return defaultPath;

    const current = this.stack.pop(); // rimuovo pagina attuale

    let previous: string | undefined;
    while (this.stack.length > 0) {
      const candidate = this.stack.pop();

      // se diversa e interna all'app
      if (candidate !== current && candidate?.startsWith("/")) {
        previous = candidate;
        break;
      }
    }

    return previous || defaultPath;
  }

  // Reset totale della history (es. logout)
  reset() {
    this.stack = [];
  }
}
