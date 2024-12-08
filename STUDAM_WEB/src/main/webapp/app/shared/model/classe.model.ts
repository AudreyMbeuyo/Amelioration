import { IEtudiant } from 'app/shared/model/etudiant.model';
import { IDepartement } from 'app/shared/model/departement.model';
import { IMatiere } from 'app/shared/model/matiere.model';

export interface IClasse {
  id?: number;
  nom?: string | null;
  etudiants?: IEtudiant[] | null;
  departement?: IDepartement | null;
  matieres?: IMatiere[] | null;
}

export const defaultValue: Readonly<IClasse> = {};
