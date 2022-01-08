import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import icArrowBack from '@iconify/icons-ic/arrow-back';

import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { Link } from 'src/@vex/interfaces/link.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'vex-pembina-detail',
  templateUrl: './pembina-detail.component.html',
  styleUrls: ['./pembina-detail.component.scss'],
  animations: [
    fadeInRight400ms,
    scaleIn400ms,
  ]
})
export class PembinaDetailComponent implements OnInit {

  icArrowBack = icArrowBack;

  level: string;
  pembina: string;

  links: Link[] = [
    {
      label: 'Overview',
      route: './',
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Statistik',
      route: './statistic'
    },
    {
      label: 'Kepengurusan',
      route: './kepengurusan',
    }
  ];

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(untilDestroyed(this))
      .subscribe(params => {
        this.level = params.get('level');
        this.pembina = params.get('pembina');
      });
  }

}
