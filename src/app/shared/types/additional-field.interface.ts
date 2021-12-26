import { Asset } from '../../pages/asset/interfaces/asset.model';
import { Jamaah } from '../../pages/jamaah/interfaces/jamaah.model';
import { CustomField } from './custom-field.model';

export interface AdditionalField {
  id: number;
  model?: Asset | Jamaah;
  value: string;
  customField?: CustomField;
}
