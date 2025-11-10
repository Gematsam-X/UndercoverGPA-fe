import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { jwtDecode } from "jwt-decode";
import { firstValueFrom } from "rxjs";

interface JWTPayload {
  exp: number;
  iat: number;
}

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const accessToken = localStorage.getItem("accessToken");

  // 🧩 1️⃣ Se non c’è token → login
  if (!accessToken) {
    console.log(localStorage);
    console.log("⚠️ Nessun accessToken trovato. Reindirizzamento al login...");
    console.log(localStorage);
    router.navigate(["login"]);
    return false;
  }

  let payload: JWTPayload | null = null;

  try {
    // 🕵️‍♂️ 2️⃣ Decodifica token (potrebbe lanciare errore)
    payload = jwtDecode<JWTPayload>(accessToken);
  } catch {
    console.warn("⚠️ Token corrotto o non decodificabile. Provo refresh...");
  }

  const now = Date.now() / 1000;
  const exp = payload?.exp ?? 0;

  // ⚠️ 3️⃣ Token scaduto o invalido → tentativo di refresh
  if (!payload || exp < now - 5) {
    console.warn("⚠️ AccessToken scaduto. Tentativo di refresh...");

    try {
      // 🔄 4️⃣ Richiedi nuovo accessToken usando il refreshToken nel cookie
      const res: any = await firstValueFrom(
        http.post("http://localhost:3000/api/auth/token", {}, { withCredentials: true })
      );

      // ✅ 5️⃣ Se il server risponde con un nuovo accessToken → salvalo
      if (res?.accessToken) {
        localStorage.setItem("accessToken", res.accessToken);
        console.log("✅ AccessToken aggiornato con successo!");
        return true;
      } else {
        throw new Error("Refresh token non valido o assente.");
      }
    } catch (refreshError) {
      // Provo a contattare il server prima di sloggare
      fetch("http://localhost:3000", { method: "GET", mode: "no-cors" })
        .then(() => {
          console.error("❌ Errore durante il refresh:", refreshError);
          localStorage.removeItem("accessToken");
          router.navigate(["login"]);
          return false;
        })
        .catch(() => {
          console.warn("⚠️ Server offline, niente redirect");
          return false;
        });

      return false; // per sicurezza
    }
  }

  // 💪 6️⃣ Token ancora valido → accesso consentito
  return true;
};
