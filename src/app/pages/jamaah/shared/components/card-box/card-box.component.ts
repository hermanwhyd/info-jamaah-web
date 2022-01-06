import { Component, Input, OnInit } from '@angular/core';
import { Icon } from '@visurel/iconify-angular';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';

@Component({
  selector: 'vex-card-box',
  templateUrl: './card-box.component.html',
  styleUrls: ['./card-box.component.scss'],
  animations: [
    fadeInRight400ms,
    scaleIn400ms,
  ]
})
export class CardBoxComponent implements OnInit {

  @Input() icon: Icon;
  @Input() label: string;
  @Input() value: string;
  @Input() loading: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
