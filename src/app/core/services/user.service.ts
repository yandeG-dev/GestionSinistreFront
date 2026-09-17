import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  telephone: string;
  statut: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Accept': 'application/json'
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`, {
      headers: this.getHeaders()
    });
  }

  toggleStatus(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/users/${id}/toggle-status`, {}, {
      headers: this.getHeaders()
    });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${id}`, {
      headers: this.getHeaders()
    });
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/professionnal`, userData, {
      headers: this.getHeaders()
    });
  }
}
