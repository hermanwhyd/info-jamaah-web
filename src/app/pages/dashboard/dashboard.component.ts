import { Component, OnInit } from '@angular/core';

import { Link } from '../../../@vex/interfaces/link.interface';
import { trackByRoute } from '../../../@vex/utils/track-by';
import { Icon } from '@visurel/iconify-angular';
import { fadeInUp400ms } from '../../../@vex/animations/fade-in-up.animation';
import { stagger40ms } from '../../../@vex/animations/stagger.animation';

import icPhoneInTalk from '@iconify/icons-ic/twotone-phone-in-talk';
import icMail from '@iconify/icons-ic/twotone-mail';

import icPolicy from '@iconify/icons-ic/round-policy';
import icPayment from '@iconify/icons-ic/baseline-payment';

import icFlag from '@iconify/icons-ic/twotone-flag';
import icLandScap from '@iconify/icons-ic/round-landscape';
import icNote2 from '@iconify/icons-ic/round-sticky-note-2';

import * as _ from 'lodash';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedPropertyService } from '../../services/shared-property.service';
import { SharedProperty } from 'src/app/types/shared-property.interface';

@Component({
  selector: 'vex-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    stagger40ms,
    fadeInUp400ms
  ]
})
export class DashboardComponent implements OnInit {
  icPhoneInTalk = icPhoneInTalk;
  icMail = icMail;

  links: (Link & { icon: Icon })[] = [
    {
      label: 'Dashboard Analisa Diklat',
      route: '/dashboard/analisa-diklat',
      icon: icPayment,
      disabled: !this.authService.hasAccess(['ADMIN'])
    },
    {
      label: 'Dashboard Evaluasi Diklat',
      route: '/dashboard/evaluasi-diklat',
      icon: icLandScap,
      disabled: !this.authService.hasAccess(['ADMIN'])
    },
    {
      label: 'Bank Diklat',
      route: '/bank-diklat',
      icon: icNote2,
      disabled: !this.authService.hasAccess(['ADMIN'])
    }
  ];

  trackByRoute = trackByRoute;

  constructor(private authService: AuthService, private sharedPropService: SharedPropertyService) { }

  sharedProps: SharedProperty[] = [];

  ngOnInit(): void {
    this.sharedProps = this.sharedPropService.getSharedPropCache();

    this.sharedPropService.findByGroup('IPORTAL_INFO')
      .subscribe(rs => {
        this.sharedPropService.storeSharePropCache(rs.data);
        this.sharedProps = rs.data;
      });
  }

  sharedPropText(code: string): string {
    const sp = this.sharedProps.find(s => s.code === code);
    return !!sp ? sp.label : '';
  }

  get tagline() {
    return this.sharedPropText('TAGL');
  }

  get description() {
    return this.sharedPropText('DESC');
  }

  get contTelp() {
    return this.sharedPropText('TELV');
  }

  get contTelpDesc() {
    return this.sharedPropText('TELD');
  }

  get contEmail() {
    return this.sharedPropText('IMLV');
  }

  get contEmailDesc() {
    return this.sharedPropText('EMLD');
  }

  get enabledLink() {
    return _.filter(this.links, { disabled: false });
  }

}
