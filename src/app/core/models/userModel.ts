export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'Admin' | 'Gestionnaire' | 'Expert' | 'Assure';
  statut: 'Actif' | 'Inactif' | 'Suspendu';
  telephone?: string;
  adresse?: string;
  two_factor_enabled: boolean;
  doit_changer_mdp: boolean;
  two_factor_expires_at?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;

  // Relations possibles selon les requêtes backend
  contrats?: any[];
  sinistres?: any[];
}
