import dayjs from 'dayjs';
import { IHoraire } from 'app/shared/model/horaire.model';
import { IEtudiant } from 'app/shared/model/etudiant.model';

export interface IEstpresent {
  id?: number;
  date?: dayjs.Dayjs | null;
  horaire?: IHoraire | null;
  etudiant?: IEtudiant | null;
}

export const defaultValue: Readonly<IEstpresent> = {};
