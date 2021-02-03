import { Icon } from '@visurel/iconify-angular';

export interface UserTableMenu {
  id?: 'all' | 'admin' | 'pegawai' ;
  icon?: Icon;
  label: string;
  classes?: {
    icon?: string;
  };
}
