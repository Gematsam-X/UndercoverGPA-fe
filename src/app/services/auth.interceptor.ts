import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

let isRefreshing = false; // 🔒 impedisce richieste di refresh multiple

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
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
    catchError(err => {
      // 👇 Se riceviamo un 400 (token scaduto)
      if (err.status === 400 && !isRefreshing) {
        isRefreshing = true;

        return from(auth.refreshToken()).pipe(
          switchMap(() => {
            isRefreshing = false;

            const newToken = auth.getToken();
            if (!newToken) {
              auth.logout();
              return throwError(() => new Error('Impossibile aggiornare il token'));
            }

            // 🔁 Ritenta la richiesta originale con il nuovo token
            const newReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });

            return next(newReq);
          }),
          catchError(refreshErr => {
            isRefreshing = false;
            auth.logout();
            return throwError(() => refreshErr);
          })
        );
      }

      // 🧱 Se è un 400 durante un refresh già in corso, si forza il logout
      if (err.status === 400 && isRefreshing) {
        auth.logout();
      }

      return throwError(() => err);
    })
  );
};