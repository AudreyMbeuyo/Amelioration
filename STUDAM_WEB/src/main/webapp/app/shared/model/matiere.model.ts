import { IHoraire } from 'app/shared/model/horaire.model';
import { IEnseignant } from 'app/shared/model/enseignant.model';
import { IClasse } from 'app/shared/model/classe.model';
import { IEtudiant } from 'app/shared/model/etudiant.model';

export interface IMatiere {
  id?: number;
  libelle?: string | null;
  code?: string | null;
  horaire?: IHoraire | null;
  enseignant?: IEnseignant | null;
  classes?: IClasse[] | null;
  etudiants?: IEtudiant[] | null;
}

export const defaultValue: Readonly<IMatiere> = {};
