import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AppHistoryService {
  private stack: string[] = [];

  /**
   * Normalizza il path rimuovendo:
   * - query params (?a=1&b=2)
   * - fragment (#qualcosa)
   */
  private normalizePath(path: string): string {
    return path.split("?")[0].split("#")[0];
  }

  /**
   * Registra una pagina nella cronologia.
   * Evita duplicati e loop tipo A-B-A-B.
   * Rimuove params e fragment.
   */
  push(path: string) {
    const cleanPath = this.normalizePath(path);

    const last = this.stack[this.stack.length - 1];
    const secondLast = this.stack[this.stack.length - 2];

    if (cleanPath === last || cleanPath === secondLast) return;

    this.stack.push(cleanPath);
  }

  /**
   * Torna indietro evitando loop e percorsi esterni.
   * Se non trova una pagina valida, ritorna defaultPath.
   */
  goBack(defaultPath: string = "/home"): string {
    if (this.stack.length === 0) return defaultPath;

    const current = this.stack.pop();

    const tempStack: string[] = [];
    let previous: string | undefined;

    while (this.stack.length > 0) {
      const candidate = this.stack.pop();
      if (candidate && candidate !== current && candidate.startsWith("/")) {
        previous = candidate;
        break;
      } else if (candidate) {
        tempStack.unshift(candidate);
      }
    }

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
