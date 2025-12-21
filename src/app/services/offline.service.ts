import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class OfflineService {
  private visible$ = new BehaviorSubject<boolean>(!navigator.onLine);

  isVisible$ = this.visible$
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor() {
    // 🔴 quando perdi la connessione
    window.addEventListener("offline", () => {
      this.show();
    });

    // 🟢 quando torni online
    window.addEventListener("online", () => {
      this.hide();
    });
  }

  show() {
    this.visible$.next(true);
  }

  hide() {
    this.visible$.next(false);
  }
}
