import { Address } from 'src/app/shared/types/address.interface';
import { SharedProperty } from 'src/app/shared/types/shared-property.interface';

export interface Residance {
  typeEnum: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;
  type: SharedProperty;
  address?: Address;
}
