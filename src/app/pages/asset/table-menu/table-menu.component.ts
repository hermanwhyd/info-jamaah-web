import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fadeInRight400ms } from '../../../../@vex/animations/fade-in-right.animation';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import { stagger40ms } from '../../../../@vex/animations/stagger.animation';
import { TableMenu } from '../interfaces/table-menu.inteface';
import _ from 'lodash';

@Component({
  selector: 'vex-table-menu',
  templateUrl: './table-menu.component.html',
  animations: [fadeInRight400ms, stagger40ms]
})
export class TableMenuComponent implements OnInit {

  @Input() items: TableMenu[];

  @Output() filterChange = new EventEmitter<TableMenu['id']>();
  @Output() openAddNew = new EventEmitter<void>();

  activeCategory: TableMenu['id'] = 'all';
  icPersonAdd = icPersonAdd;

  constructor() { }

  ngOnInit() { }

  setFilter(category: TableMenu['id']) {
    if (this.activeCategory === category) { return; }

    this.activeCategory = category;

    return this.filterChange.emit(category);
  }

  isActive(category: TableMenu['id']) {
    return this.activeCategory === category;
  }
}
