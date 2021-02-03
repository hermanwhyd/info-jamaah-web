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
    public photo?: string,
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
