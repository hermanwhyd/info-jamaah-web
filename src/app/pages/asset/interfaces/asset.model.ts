import { AdditionalField } from 'src/app/types/additional-field.interface';
import { Notifier } from 'src/app/types/notifier.interface';
import { SharedProperty } from 'src/app/types/shared-property.interface';
import { User } from '../../user/interfaces/user.interface';

export interface Asset {
  id: number;
  title: string;
  tagNo: string;
  categoryEnum: string;
  statusEnum: string;
  locationId: number;
  pembinaEnum: string;
  avatar: string;
  category?: SharedProperty;
  status?: SharedProperty;
  pembina?: SharedProperty;
  location?: Location;
  additionalFields: AdditionalField[];
  maintenances?: AssetMaintenance[];
  audits?: AssetAudit[];
  media?: AssetMedia[];
  photos?: AssetMedia[];
  notifiers?: Notifier[];
}

export interface Location {
  id: number;
  label: string;
  typeEnum: string;
  type?: SharedProperty;
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
  notifiers: Notifier[];
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


