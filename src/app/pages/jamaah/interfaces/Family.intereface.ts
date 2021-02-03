import { SharedProperty } from 'src/app/types/shared-property.interface';
import { Jamaah } from './jamaah.model';
import { Residance } from './residance.model';

export interface Family {
  id: number;
  kepalaKeluargaId: number;
  residanceId: number;
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
