import { Variable } from './variable.model';

export interface SharedProperty {
  id?: number;
  group?: string;
  code: string;
  label: string;
  position?: number;
  removable?: boolean;
  variables?: Variable[];
  banner?: string;
}
