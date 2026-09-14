export interface Document {
  id: number;
  chemin_fichier: string;
  type_document: string;  // ex: 'jpg', 'pdf'
  sinistre_id: number;
  created_at: string;
  updated_at: string;
}

export interface Sinistre {
  id: number;
  numeroDossier: string;
  typeSinistre: string;
  dateSinistre: string;        // format 'YYYY-MM-DD'
  heureSinistre: string | null; // format 'HH:MM' ou null
  description: string;
  lieuSinistre: string;
  statut: 'En attente' | 'En cours' | 'Clôturé' | 'Archivé';
  assure_id: number;
  gestionnaire_id: number | null;
  expert_id: number | null;
  contrat_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  // Relations (présentes selon le with() utilisé dans le backend)
  documents?: Document[];
  contrat?: any;
  assure?: any;
}

/**
 * Données du formulaire étape 1 (info-sinistre)
 * Stockées dans SinistreService.sinistreData en attendant l'étape 2
 */
export interface SinistreFormData {
  typeSinistre: string;
  dateSinistre: string;
  heureSinistre: string;
  lieuSinistre: string;
  description: string;
}

/**
 * Réponse du backend après POST /api/sinistres
 */
export interface DeclarerSinistreResponse {
  message: string;
  sinistre: Sinistre;
  fichiers_joints: Document[];
}
