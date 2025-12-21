import { inject } from "@angular/core";
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from "@angular/common/http";
import { Observable, from, throwError, BehaviorSubject } from "rxjs";
import { catchError, switchMap, filter, take } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

const errorCodes: number[] = [400, 401, 402, 403];

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const auth = inject(AuthService);

  // ⛔ non intercettare la richiesta di refresh per non creare loop
  if (req.url.includes("/auth/token")) return next(req);

  const token = auth.getToken();

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(authReq).pipe(
    catchError((err) => {
      // Se la richiesta contiene "backup", non fai logout al 401
      const isBackupRequest = req.url.includes("backup");

      if (errorCodes.includes(err.status) && !isBackupRequest) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return from(auth.refreshToken()).pipe(
            switchMap(() => {
              const newToken = auth.getToken();
              if (!newToken) {
                auth.logout();
                return throwError(() => new Error("Impossibile aggiornare il token"));
              }

              isRefreshing = false;
              refreshTokenSubject.next(newToken);

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
        } else {
          return refreshTokenSubject.pipe(
            filter((token) => token != null),
            take(1),
            switchMap((newToken) => {
              const newReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next(newReq);
            })
          );
        }
      }

      // Se è una richiesta backup, passa l'errore senza fare logout
      return throwError(() => err);
    })
  );
};
