import { inject } from "@angular/core";
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from "@angular/common/http";
import { Observable, from, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

let isRefreshing: boolean = false; // 🔒 impedisce richieste di refresh multiple
const errorCodes: number[] = [400, 401, 402, 403];

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  let authReq = req;

  // 🔑 Se abbiamo un accessToken, aggiungiamolo all'header Authorization
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(authReq).pipe(
    catchError((err) => {
      // 👇 Se riceviamo un errore
      if (errorCodes.includes(err.status) && !isRefreshing) {
        isRefreshing = true;

        return from(auth.refreshToken()).pipe(
          switchMap(() => {
            isRefreshing = false;

            const newToken = auth.getToken();
            if (!newToken) {
              auth.logout();
              return throwError(() => new Error("Impossibile aggiornare il token"));
            }

            // 🔁 Ritenta la richiesta originale con il nuovo token
            const newReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });

            return next(newReq);
          }),
          catchError((refreshErr) => {
            isRefreshing = false;
            auth.logout();
            return throwError(() => refreshErr);
          })
        );
      }

      // 🧱 Se è un errore durante un refresh già in corso, si forza il logout
      if (errorCodes.includes(err.status) && isRefreshing) {
        auth.logout();
      }

      return throwError(() => err);
    })
  );
};
