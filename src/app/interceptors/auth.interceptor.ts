import { inject } from "@angular/core";
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from "@angular/common/http";
import { Observable, from, throwError, BehaviorSubject, of } from "rxjs";
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

  // ⛔ non intercettare la richiesta di refresh
  if (req.url.includes("/auth/token")) {
    return next(req);
  }

  const token = auth.getToken();

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(authReq).pipe(
    catchError((err) => {
      if (errorCodes.includes(err.status)) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null); // reset

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
          // 🚀 Se è già in corso un refresh, metti la richiesta in attesa
          return refreshTokenSubject.pipe(
            filter((token) => token != null), // aspetta fino a che arriva il token nuovo
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

      return throwError(() => err);
    })
  );
};
