import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import icDelete from '@iconify/icons-ic/twotone-delete-outline';
import icTime from '@iconify/icons-ic/baseline-access-time';

@Component({
  selector: 'vex-pengurus-profile',
  templateUrl: './pengurus-profile.component.html',
  styleUrls: ['./pengurus-profile.component.scss']
})
export class PengurusProfileComponent implements OnInit {

  icDelete = icDelete;
  icTime = icTime;

  @Input() avatar: string;
  @Input() name: string;
  @Input() time: string;
  @Input() description: string;

  @Output() openDialogDel = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
