import { Kepengurusan } from 'src/app/pages/pembina/shared/kepengurusan.interface';
import { Jamaah } from '../../pages/jamaah/shared/interfaces/jamaah.model';
import { CustomField } from './custom-field.model';
import { Variable } from './variable.model';

export interface SharedProperty {
  id?: number;
  group?: string;
  code: string;
  label: string;
  position?: number;
  removable?: boolean;
  variables?: Variable[];
  customFields?: CustomField[];
  enumables?: Enumable[];
  kepengurusans?: Kepengurusan[];
}

export interface Enumable {
  id: number;
  model?: Jamaah | null;
}
