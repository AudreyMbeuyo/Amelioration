import { IDepartement } from 'app/shared/model/departement.model';

export interface IEnseignant {
  id?: number;
  nom?: string | null;
  email?: string | null;
  password?: string | null;
  departement?: IDepartement | null;
}

export const defaultValue: Readonly<IEnseignant> = {};
