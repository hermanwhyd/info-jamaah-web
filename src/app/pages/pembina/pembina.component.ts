import { Component, OnInit } from '@angular/core';
import { Link } from '../../../@vex/interfaces/link.interface';
import { Icon } from '@visurel/iconify-angular';
import { fadeInUp400ms } from '../../../@vex/animations/fade-in-up.animation';
import { stagger40ms } from '../../../@vex/animations/stagger.animation';
import { trackByRoute } from '../../../@vex/utils/track-by';

import icPhoneInTalk from '@iconify/icons-ic/twotone-phone-in-talk';
import icMail from '@iconify/icons-ic/twotone-mail';

import icPayment from '@iconify/icons-ic/baseline-payment';

import icLandScap from '@iconify/icons-ic/round-landscape';
import icNote2 from '@iconify/icons-ic/round-sticky-note-2';

import _ from 'lodash';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'vex-pembina',
  templateUrl: './pembina.component.html',
  styleUrls: ['./pembina.component.scss'],
  animations: [
    stagger40ms,
    fadeInUp400ms
  ]
})
export class PembinaComponent implements OnInit {
  icPhoneInTalk = icPhoneInTalk;
  icMail = icMail;

  links: (Link & { icon: Icon })[] = [
    {
      label: 'Desa Japos',
      route: 'DS/JPS',
      icon: icPayment,
      disabled: !this.authService.hasAccess(['ADMIN'])
    },
    {
      label: 'Kelompok VJ',
      route: 'KLP/VJ',
      icon: icLandScap,
      disabled: !this.authService.hasAccess(['ADMIN'])
    },
    {
      label: 'Kelompok PJI',
      route: 'KLP/PJI',
      icon: icNote2,
      disabled: !this.authService.hasAccess(['ADMIN'])
    },
    {
      label: 'Kelompok TMI',
      route: 'KLP/TMI',
      icon: icNote2,
      disabled: !this.authService.hasAccess(['ADMIN'])
    },
    {
      label: 'Kelompok PDA',
      route: 'KLP/PDA',
      icon: icNote2,
      disabled: !this.authService.hasAccess(['ADMIN'])
    }
  ];

  trackByRoute = trackByRoute;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

}
