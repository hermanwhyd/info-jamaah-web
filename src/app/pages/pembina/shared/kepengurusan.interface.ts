import { SharedProperty } from 'src/app/shared/types/shared-property.interface';
import { Jamaah } from '../../jamaah/shared/interfaces/jamaah.model';
import { Pembina } from './pembina.interface';

export interface Kepengurusan {
  id?: number;
  jamaah?: Jamaah;
  pembina?: Pembina;
  dapukan?: SharedProperty;
}
