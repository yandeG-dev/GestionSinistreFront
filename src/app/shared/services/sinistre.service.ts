import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SinistreService {
  private apiUrl = 'http://localhost:8000/api';
  private sinistreData: any = null;

  constructor(private http: HttpClient) { }

  setSinistreData(data: any) { this.sinistreData = data; }
  getSinistreData() { return this.sinistreData; }
  clearSinistreData() { this.sinistreData = null; }

  getContratsAssure(): Observable<any> {
    return this.http.get(`${this.apiUrl}/assure/contrats`);
  }

  declarerSinistre(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/sinistres`, formData);
  }
}
