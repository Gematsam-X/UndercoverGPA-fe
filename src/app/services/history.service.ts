import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AppHistoryService {
  private stack: string[] = [];

  /** 
   * Registra una pagina nella cronologia.
   * Evita sequenze ripetitive tipo A-B-A-B.
   */
  push(path: string) {
    const last = this.stack[this.stack.length - 1];
    const secondLast = this.stack[this.stack.length - 2];

    if (path === last || path === secondLast) return;

    this.stack.push(path);
  }

  /**
   * Torna indietro evitando loop e percorsi esterni.
   * Se non trova una pagina valida, ritorna defaultPath.
   */
  goBack(defaultPath: string = "/home"): string {
    if (this.stack.length === 0) return defaultPath;

    const current = this.stack.pop(); // rimuovo pagina attuale

    // Copia temporanea della stack per non distruggerla troppo
    const tempStack: string[] = [];
    let previous: string | undefined;

    while (this.stack.length > 0) {
      const candidate = this.stack.pop();
      if (candidate && candidate !== current && candidate.startsWith("/")) {
        previous = candidate;
        break;
      } else if (candidate) {
        // tieni traccia dei percorsi scartati
        tempStack.unshift(candidate);
      }
    }

    // Rimetti indietro i percorsi scartati
    this.stack.push(...tempStack);

    return previous || defaultPath;
  }

  /** Reset totale della history (es. logout) */
  reset() {
    this.stack = [];
  }

  /** Per debug / logging */
  getHistory() {
    return [...this.stack];
  }
}
