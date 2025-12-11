import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConnectingServerService {
  private connectingSubject = new BehaviorSubject<boolean>(false);
  isConnecting$ = this.connectingSubject.asObservable();

  private pendingCount = 0; // numero di richieste in corso

  show() {
    this.pendingCount++;
    if (this.pendingCount === 1) {
      // mostra la modale solo quando parte la prima richiesta
      this.connectingSubject.next(true);
    }
  }

  hide() {
    this.pendingCount--;
    if (this.pendingCount <= 0) {
      this.pendingCount = 0;
      this.connectingSubject.next(false); // nasconde la modale solo se non ci sono richieste pendenti
    }
  }
}
