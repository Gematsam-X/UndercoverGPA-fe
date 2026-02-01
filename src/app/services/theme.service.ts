import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class ThemeService {
  private darkTheme$ = new BehaviorSubject<boolean>(false);
  theme$ = this.darkTheme$.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem("darkTheme") === "true";
    this.darkTheme$.next(savedTheme);
  }

  setDarkTheme(isDark: boolean) {
    this.darkTheme$.next(isDark);
    localStorage.setItem("darkTheme", String(isDark));
  }

  toggleTheme() {
    this.setDarkTheme(!this.darkTheme$.value);
  }

  isDark(): boolean {
    return this.darkTheme$.value;
  }
}
