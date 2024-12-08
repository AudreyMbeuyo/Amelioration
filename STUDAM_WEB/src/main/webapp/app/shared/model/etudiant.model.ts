import { IMatiere } from 'app/shared/model/matiere.model';
import { IClasse } from 'app/shared/model/classe.model';

export interface IEtudiant {
  id?: number;
  matricule?: string | null;
  nom?: string | null;
  prenom?: string | null;
  matieres?: IMatiere[] | null;
  classes?: IClasse[] | null;
}

export const defaultValue: Readonly<IEtudiant> = {};
