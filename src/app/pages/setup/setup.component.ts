import {
  Component,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';

import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { SidebarMenu } from './interfaces/sidebar-menu.interface';
import { SetupEnumComponent } from './components/setup-enum/setup-enum.component';
import { SetupCustomFieldComponent } from './components/setup-custom-field/setup-custom-field.component';

@Component({
  selector: 'vex-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  animations: [
    stagger80ms,
    fadeInRight400ms,
    fadeInUp400ms
  ]
})
export class SetupComponent implements OnInit {
  menuWidth = '250px';

  sidebarMenu: SidebarMenu[] = [
    { type: 'subheader', title: 'PEMBINA', active: false },
    {
      type: 'link',
      element: 'setupEnumList',
      title: 'Dapukan Desa',
      active: false,
      data: {
        group: 'DAPUKAN_DS',
        description: '?'
      }
    },
    {
      type: 'link',
      element: 'setupEnumList',
      title: 'Dapukan Kelompok',
      active: false,
      data: {
        group: 'DAPUKAN_KLP',
        description: '?'
      }
    },
    { type: 'subheader', title: 'JAMAAH', active: false },
    {
      type: 'link',
      element: 'setupCustomFieldList',
      title: 'Jamaah Model',
      active: false,
      data: {
        group: 'CUSTOM_FIELD_JAMAAH',
        description: 'Data-data tambahan untuk model Jamaah. Data dikelompokan berdasarkan kategori tertentu.'
      }
    },
    {
      type: 'link',
      element: 'setupEnumList',
      title: 'Hubungan Keluarga',
      active: false,
      data: {
        group: 'FAMS_RELATIONSHIP',
        description: '?'
      }
    },
    {
      type: 'link',
      element: 'setupEnumList',
      title: 'Tipe Tempat Tinggal',
      active: false,
      data: {
        group: 'RESIDANCE_TYPE',
        description: '?'
      }
    },
    { type: 'subheader', title: 'ASSET', active: false },
    {
      type: 'link',
      element: 'setupCustomFieldList',
      title: 'Asset Model',
      active: false,
      data: {
        group: 'CUSTOM_FIELD_ASSET',
        description: 'Data-data tambahan untuk model Asset. Data dikelompokan berdasarkan kategori tertentu.'
      }
    },
    {
      type: 'link',
      element: 'setupEnumList',
      title: 'Kategori Aset',
      active: false,
      data: {
        group: 'ASSET_CATEGORY',
        description: '?'
      }
    },
    {
      type: 'link',
      element: 'setupEnumList',
      title: 'Detail Aset',
      active: false,
      data: {
        group: 'ASSET_DETAIL',
        description: '?'
      }
    },
    {
      type: 'link',
      element: 'setupEnumList',
      title: 'Status Aset',
      active: false,
      data: {
        group: 'ASSET_STATUS',
        description: '?'
      }
    },
    {
      type: 'link',
      element: 'setupEnumList',
      title: 'Tipe Perawatan Aset',
      active: false,
      data: {
        group: 'MAINTENANCE_TYPE',
        description: '?'
      }
    },
    {
      type: 'link',
      element: 'setupEnumList',
      title: 'Tipe Lokasi Aset',
      active: false,
      data: {
        group: 'LOCATION_TYPE',
        description: '?'
      }
    }
  ];

  @ViewChildren(SetupEnumComponent) setupEnumList: QueryList<SetupEnumComponent>;
  @ViewChildren(SetupCustomFieldComponent) setupCustomFieldList: QueryList<SetupCustomFieldComponent>;
  constructor() { }

  ngOnInit(): void {
    this.sidebarMenu[1].active = true;
  }

  scrollTo(element: SidebarMenu) {
    const idx = this.sidebarMenu.filter(f => f.element === element.element).indexOf(element);
    this[element.element].toArray()[idx].scrollIntoView({
      block: 'center',
      behavior: 'smooth'
    });
    // -- Set active
    this.sidebarMenu.forEach(sm => sm.active = false);
    element.active = true;
  }

  get getLinkMenu() {
    return this.sidebarMenu.filter(f => f.type === 'link');
  }
}
