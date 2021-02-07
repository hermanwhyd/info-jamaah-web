import { Component, OnInit } from '@angular/core';
import { Link } from 'src/@vex/interfaces/link.interface';
import { scaleIn400ms } from '../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../@vex/animations/fade-in-right.animation';
import icArrowBack from '@iconify/icons-ic/arrow-back';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { JamaahService } from '../service/jamaah.service';
import { Jamaah } from '../interfaces/jamaah.model';

@UntilDestroy()
@Component({
  selector: 'vex-jamaah-detail',
  templateUrl: './jamaah-detail.component.html',
  styleUrls: ['./jamaah-detail.component.scss'],
  animations: [
    fadeInRight400ms,
    scaleIn400ms,
  ]
})
export class JamaahDetailComponent implements OnInit {

  model: Jamaah;
  icArrowBack = icArrowBack;

  links: Link[] = [
    {
      label: 'Profil',
      route: './',
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Pembinaan',
      route: './pembinaan',
      disabled: true,
    },
    {
      label: 'Organisasi',
      route: './pembinaan',
      disabled: true,
    }
  ];

  constructor(private route: ActivatedRoute, private jamaahSvc: JamaahService) { }

  ngOnInit(): void {
    this.initModel();
  }

  private initModel() {
    this.route.paramMap
      .pipe(untilDestroyed(this))
      .subscribe(params => {
        const id = params.get('id');
        this.jamaahSvc.getById(id).subscribe(g => {
          this.model = g.data;
        });
      });
  }
}
