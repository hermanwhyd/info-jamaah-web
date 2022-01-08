import { Kepengurusan } from 'src/app/pages/pembina/shared/kepengurusan.interface';
import { SharedProperty } from 'src/app/shared/types/shared-property.interface';
import { AssetMedia } from '../../../asset/interfaces/asset.model';
import { Contact } from './contact.interface';
import { Family } from './Family.intereface';

export class Jamaah {
  constructor(
    public id: number,
    public fullName: string,
    public nickname?: string,
    public gender?: string,
    public birthDate?: Date,
    public pembinaEnum?: string,
    public lvPembinaamEnum?: string,
    public avatar?: string,
    public photos?: AssetMedia[],
    public lvPembinaan?: SharedProperty,
    public contacts?: Contact[],
    public family?: Family,
    public families?: Family[],
    public kepengurusans?: Kepengurusan[]
  ) { }
}

export interface JamaahPengurus {
  lvPembinaEnum: string;
  pembina: SharedProperty;
  pengurus?: Kepengurusan[];
}
