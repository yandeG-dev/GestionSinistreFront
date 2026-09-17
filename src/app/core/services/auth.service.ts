import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}/auth/login`, body).pipe(
      tap((response: any) => {
        if (!response.requires_2fa && response.access_token) {
          localStorage.setItem('auth_token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }

  verify2fa(email: string, code: string): Observable<any> {
    const body = { email, code };
    return this.http.post(`${this.apiUrl}/auth/verify-2fa`, body).pipe(
      tap((response: any) => {
        if (response.access_token) {
          localStorage.setItem('auth_token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }

  toggle2FA(enabled: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/auth/toggle-2fa`, { two_factor_enabled: enabled }, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`,
        'Accept': 'application/json'
      })
    }).pipe(
      tap((response: any) => {
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/change-password`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`,
        'Accept': 'application/json'
      })
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.clearSession();
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return user && user.role === role;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clearSession() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
}
