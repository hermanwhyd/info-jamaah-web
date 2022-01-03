import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import icDelete from '@iconify/icons-ic/twotone-delete-outline';

@Component({
  selector: 'vex-pengurus-profile',
  templateUrl: './pengurus-profile.component.html',
  styleUrls: ['./pengurus-profile.component.scss']
})
export class PengurusProfileComponent implements OnInit {

  icDelete = icDelete;

  @Input() avatar: string;
  @Input() name: string;
  @Input() time: string;

  @Output() openDialogDel = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
