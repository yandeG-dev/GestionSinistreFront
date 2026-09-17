export interface Remboursement {
  id: number;
  numeroDossier: string;
  typeSinistre: string;
  montant: number;
  dateVirement: string;
  statutRemboursement: string;
}
