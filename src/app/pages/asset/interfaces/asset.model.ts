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
  avatar: string;
  category?: SharedProperty;
  status?: SharedProperty;
  owner?: Owner;
  location?: Location;
  details?: Detail[];
  maintenances?: AssetMaintenance[];
  audits?: AssetAudit[];
  media?: AssetMedia[];
  photos?: AssetMedia[];
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
  supplierId: number;
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
  uuid: string;
  name: string;
  collection: SharedProperty;
  mimeType: string;
  size: number;
  disk: string;
  file: FileUrl;
  properties: any;
  createdAt: Date;
}

export interface FileUrl {
  thumb: string;
  url: string;
  download: string;
}


