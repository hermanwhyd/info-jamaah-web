import { SharedProperty } from 'src/app/shared/types/shared-property.interface';
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
    public photos?: Photo,
    public lvPembinaan?: SharedProperty,
    public contacts?: Contact[],
    public details?: JamaahDetail[],
    public family?: Family,
    public families?: Family[],
  ) { }
}

export interface JamaahDetail {
  id: number;
  typeEnum: string;
  label: string;
  value: string;
}

export interface Photo {
  closeup: string;
  thumb: string;
}
