import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sinistre, SinistreFormData, DeclarerSinistreResponse } from '../models/sinistre.model';

@Injectable({
  providedIn: 'root'
})
export class SinistreService {
  private apiUrl = 'http://localhost:8000/api';
  private sinistreData: SinistreFormData | null = null;
  private lastSinistreResponse: DeclarerSinistreResponse | null = null;

  constructor(private http: HttpClient) { }

  setSinistreData(data: SinistreFormData | Sinistre) { this.sinistreData = data as SinistreFormData; }
  getSinistreData(): SinistreFormData | null { return this.sinistreData; }
  clearSinistreData() { this.sinistreData = null; }

  setLastSinistreResponse(response: DeclarerSinistreResponse) { this.lastSinistreResponse = response; }
  getLastSinistreResponse(): DeclarerSinistreResponse | null { return this.lastSinistreResponse; }
  clearLastSinistreResponse() { this.lastSinistreResponse = null; }

  getContratsAssure(): Observable<any> {
    return this.http.get(`${this.apiUrl}/assure/contrats`);
  }

  declarerSinistre(formData: FormData): Observable<DeclarerSinistreResponse> {
    // Ne pas mettre Content-Type manuellement pour FormData (le browser le gère avec boundary)
    // Mais Accept: application/json est crucial pour que Laravel retourne du JSON
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    return this.http.post<DeclarerSinistreResponse>(`${this.apiUrl}/sinistres`, formData, { headers });
  }

  mesSinistres(): Observable<Sinistre[]> {
    return this.http.get<Sinistre[]>(`${this.apiUrl}/sinistres`);
  }
}

