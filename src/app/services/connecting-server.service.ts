import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConnectingServerService {
  private connectingSubject = new BehaviorSubject<boolean>(false);
  isConnecting$ = this.connectingSubject.asObservable();

  show() {
    this.connectingSubject.next(true);
  }

  hide() {
    this.connectingSubject.next(false);
  }
}
