import dayjs from 'dayjs';
import { Jour } from 'app/shared/model/enumerations/jour.model';

export interface IHoraire {
  id?: number;
  jour?: keyof typeof Jour | null;
  heureDebut?: dayjs.Dayjs | null;
  heureFin?: dayjs.Dayjs | null;
}

export const defaultValue: Readonly<IHoraire> = {};
