import { inject, Injectable } from "@angular/core";
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { OfflineService } from "../services/offline.service";

export const OfflineInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const offlineService = inject(OfflineService);

  if (!navigator.onLine) {
    offlineService.show();

    return throwError(() => ({
      offline: true,
      message: "Client offline",
    }));
  }

  return next(req);
};
