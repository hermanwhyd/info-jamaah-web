import { Jamaah } from '../pages/jamaah/interfaces/jamaah.model';
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
}

export interface Enumable {
  id: number;
  model?: Jamaah | null;
}
