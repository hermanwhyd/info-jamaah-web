import { Jamaah } from '../../jamaah/shared/interfaces/jamaah.model';

export interface User {
  id: number | string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  roles: string[];
  jamaah?: Jamaah;
  createdAt: Date;
}
