import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // GET generico
  get<T>(endpoint: string, options: Record<string, any> = {}): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
      withCredentials: true,
      observe: 'body',
      ...options
    });
  }

  // POST generico
  post<T>(endpoint: string, body: any, options: Record<string, any> = {}): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, {
      withCredentials: true,
      observe: 'body',
      ...options
    });
  }

  // PUT generico
  put<T>(endpoint: string, body: any, options: Record<string, any> = {}): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, {
      withCredentials: true,
      observe: 'body',
      ...options
    });
  }

  // DELETE generico
  delete<T>(endpoint: string, options: Record<string, any> = {}): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, {
      withCredentials: true,
      observe: 'body',
      ...options
    });
  }
}
