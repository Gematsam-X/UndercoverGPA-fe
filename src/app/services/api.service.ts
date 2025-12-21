import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { ConnectingServerService } from "../services/connecting-server.service";
@Injectable({
  providedIn: "root",
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private connectingService: ConnectingServerService) {}

  private withPendingCheck<T>(obs: Observable<T>): Observable<T> {
    let finished = false;

    const timer = setTimeout(() => {
      if (!finished) {
        this.connectingService.show();
      }
    }, 1500);

    return obs.pipe(
      finalize(() => {
        finished = true;
        clearTimeout(timer);
        this.connectingService.hide();
      })
    );
  }

  get<T>(endpoint: string, options: Record<string, any> = {}): Observable<T> {
    return this.withPendingCheck(
      this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
        withCredentials: true,
        observe: "body",
        ...options,
      })
    );
  }

  post<T>(endpoint: string, body: any, options: Record<string, any> = {}): Observable<T> {
    return this.withPendingCheck(
      this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, {
        withCredentials: true,
        observe: "body",
        ...options,
      })
    );
  }

  put<T>(endpoint: string, body: any, options: Record<string, any> = {}): Observable<T> {
    return this.withPendingCheck(
      this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, {
        withCredentials: true,
        observe: "body",
        ...options,
      })
    );
  }

  delete<T>(endpoint: string, options: Record<string, any> = {}): Observable<T> {
    return this.withPendingCheck(
      this.http.delete<T>(`${this.baseUrl}/${endpoint}`, {
        withCredentials: true,
        observe: "body",
        ...options,
      })
    );
  }
}
