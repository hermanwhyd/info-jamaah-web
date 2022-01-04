import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

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
    { type: 'subheader', title: 'SHARED PROPERTY', element: '', active: false },
    { type: 'link', element: 'setupEnumList', title: 'Kategori Aset', active: false },
    { type: 'link', element: 'setupEnumList', title: 'Detail Aset', active: false },
    { type: 'link', element: 'setupEnumList', title: 'Status Aset', active: false },
    { type: 'link', element: 'setupEnumList', title: 'Tipe Perawatan Aset', active: false },
    { type: 'subheader', title: 'CUSTOM FIELD', element: '', active: false },
    { type: 'link', element: 'setupCustomFieldList', title: 'Asset Model', active: false },
    { type: 'link', element: 'setupCustomFieldList', title: 'Jamaah Model', active: false },
    { type: 'subheader', title: 'DAPUKAN', element: '', active: false },
    { type: 'link', element: 'setupEnumList', title: 'Dapukan Desa', active: false },
    { type: 'link', element: 'setupEnumList', title: 'Dapukan Kelompok', active: false }
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
}
