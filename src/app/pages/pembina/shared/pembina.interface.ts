import { SharedProperty } from 'src/app/shared/types/shared-property.interface';
import { Kepengurusan } from './kepengurusan.interface';

export interface Pembina extends SharedProperty {
  child?: Pembina[];
  jamaahCount?: number;
}

export interface PengurusTable {
  dapuan: SharedProperty;
  pengurus?: Kepengurusan[];
}
