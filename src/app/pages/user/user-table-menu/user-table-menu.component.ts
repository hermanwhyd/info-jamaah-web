import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fadeInRight400ms } from '../../../../@vex/animations/fade-in-right.animation';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import { stagger40ms } from '../../../../@vex/animations/stagger.animation';
import { UserTableMenu } from '../interfaces/user-table-menu.inteface';
import * as _ from 'lodash';

@Component({
  selector: 'vex-user-table-menu',
  templateUrl: './user-table-menu.component.html',
  animations: [fadeInRight400ms, stagger40ms]
})
export class UserTableMenuComponent implements OnInit {

  @Input() items: UserTableMenu[];

  @Output() filterChange = new EventEmitter<UserTableMenu['id']>();
  @Output() openAddNew = new EventEmitter<void>();

  activeCategory: UserTableMenu['id'] = 'all';
  icPersonAdd = icPersonAdd;

  constructor() { }

  ngOnInit() {}

  setFilter(category: UserTableMenu['id']) {
    if (this.activeCategory === category) { return; }

    this.activeCategory = category;

    return this.filterChange.emit(category);
  }

  isActive(category: UserTableMenu['id']) {
    return this.activeCategory === category;
  }
}
