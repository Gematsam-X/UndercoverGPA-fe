import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        // token scaduto → rinnova
        return from(auth.refreshToken()).pipe(
          switchMap(() => {
            const newToken = auth.getToken();
            const newReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(newReq);
          }),
          catchError(innerErr => {
            auth.logout();
            return throwError(() => innerErr);
          })
        );
      }
      return throwError(() => err);
    })
  );
};
