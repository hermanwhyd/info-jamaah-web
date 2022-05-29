import { Pembina } from 'src/app/shared/types/pembina.interface';
import { Residance } from 'src/app/shared/types/residance.model';
import { SharedProperty } from 'src/app/shared/types/shared-property.interface';
import { Jamaah } from '../../../jamaah/shared/interfaces/jamaah.model';

export interface Family {
  id: number;
  kepalaKeluargaId: number;
  label: string;
  pembinaEnum: string;
  residanceId: number;
  pembina?: Pembina;
  kepalaKeluarga?: Jamaah;
  residance?: Residance;
  members?: Member[];
}

export interface Member {
  familyId: number;
  jamaahId: number;
  relationshipEnum: string;
  status: string;
  position: number;
  jamaah: Jamaah;
  relationship: SharedProperty;
}
