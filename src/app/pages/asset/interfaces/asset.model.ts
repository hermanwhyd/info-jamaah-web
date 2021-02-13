import { SharedProperty } from 'src/app/types/shared-property.interface';
import { User } from '../../user/interfaces/user.interface';

export interface Asset {
  id: number;
  title: string;
  tagNo: string;
  categoryEnum: string;
  statusEnum: string;
  locationId: number;
  ownerEnum: string;
  category?: SharedProperty;
  status?: SharedProperty;
  owner?: Owner;
  location?: Location;
  details?: Detail[];
  maintenances?: AssetMaintenance[];
  audits?: AssetAudit[];
  medias?: AssetMedia[];
}

export interface Detail {
  id: number;
  assetId: number;
  typeEnum: string;
  value: string;
  type?: SharedProperty;
}

export interface Location {
  id: number;
  label: string;
  typeEnum: string;
  type?: SharedProperty;
}

export interface Owner {
  lvPembina: string;
  initial: string;
  label: string;
}

export interface AssetMaintenance {
  id: number;
  assetId: number;
  title: string;
  typeEnum: string;
  notes: string;
  startDate: Date;
  endDate: Date;
  type?: SharedProperty;
  supplier?: Supplier;
  creator?: User;
}

export interface Supplier {
  id: number;
  title: string;
}

export interface AssetAudit {
  id: number;
  auditedAt: Date;
  assetId: number;
  locationId: number;
  assetStatusEnum: string;
  notes: string;
  assetStatus?: SharedProperty;
  location?: Location;
}

export interface AssetMedia {
  id: number;
}
