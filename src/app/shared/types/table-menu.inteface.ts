import { Icon } from '@visurel/iconify-angular';

export interface TableMenu {
  id?: 'all' | 'admin' | 'pegawai';
  icon?: Icon;
  label: string;
  classes?: {
    icon?: string;
  };
}
