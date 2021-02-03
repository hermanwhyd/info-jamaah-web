import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { LayoutService } from '../../../@vex/services/layout.service';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { fadeInRight400ms } from '../../../@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '../../../@vex/animations/fade-in-up.animation';
import { stagger80ms } from '../../../@vex/animations/stagger.animation';
import { SidebarMenu } from './interfaces/sidebar-menu.interface';
import { SetupIportalInfoComponent } from './components/setup-iportal-info/setup-iportal-info.component';
import { SetupEnumComponent } from './components/setup-enum/setup-enum.component';
import { SetupTagComponent } from './components/setup-tag/setup-tag.component';

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
    { type: 'subheader', title: 'IPORTAL INFO', element: '', active: false },
    { type: 'link', element: 'infoiportal', title: 'Informasi IPortal', active: false },
    { type: 'subheader', title: 'SHARED PROPERTY', element: '', active: false },
    { type: 'link', element: 'diklatinitiator', title: 'Inisiator Diklat', active: false },
    { type: 'link', element: 'evaluationtarget', title: 'Subyek Evaluasi', active: false },
    { type: 'link', element: 'banner', title: 'Banner Mobile Apps', active: false },
    { type: 'subheader', title: 'TAG', element: '', active: false },
    { type: 'link', element: 'diklatcategori', title: 'Kategori Diklat', active: false }
  ];

  @ViewChild(SetupIportalInfoComponent, { read: ElementRef, static: true }) private infoiportal: ElementRef;
  @ViewChild(SetupEnumComponent, { read: ElementRef, static: true }) private evaluationtarget: ElementRef;
  @ViewChild(SetupEnumComponent, { read: ElementRef, static: true }) private diklatinitiator: ElementRef;
  @ViewChild(SetupTagComponent, { read: ElementRef, static: true }) private banner: ElementRef;
  @ViewChild(SetupTagComponent, { read: ElementRef, static: true }) private diklatcategori: ElementRef;
  constructor(private layoutService: LayoutService,
              private scrollDispatcher: ScrollDispatcher,
              private elem: ElementRef) { }

  ngOnInit(): void {
    this.sidebarMenu[1].active = true;
  }

  scrollTo(element: SidebarMenu) {
    this.scrollDispatcher.getAncestorScrollContainers(this.elem)[0].scrollTo({
      top: this[element.element].nativeElement.offsetTop - 24,
      behavior: 'smooth'
    });

    // -- Set active
    this.sidebarMenu.forEach(sm => sm.active = false);
    element.active = true;
  }
}
