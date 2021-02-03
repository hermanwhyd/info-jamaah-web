import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';

import faGender from '@iconify/icons-fa-solid/venus-mars';
import faReligion from '@iconify/icons-fa-solid/praying-hands';
import icNumber from '@iconify/icons-ic/baseline-assignment-ind';
import icArrowBack from '@iconify/icons-ic/arrow-back';
import icMail from '@iconify/icons-ic/twotone-mail';
import icAccessTime from '@iconify/icons-ic/twotone-access-time';
import icWork from '@iconify/icons-ic/twotone-work';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icCheck from '@iconify/icons-ic/twotone-check';
import icView from '@iconify/icons-ic/remove-red-eye';
import icQuestion from '@iconify/icons-ic/help-outline';
import icHome from '@iconify/icons-ic/baseline-home';
import icMap from '@iconify/icons-ic/baseline-map';

import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Jamaah } from '../interfaces/jamaah.model';
import { JamaahService } from '../service/jamaah.service';

@UntilDestroy()
@Component({
  selector: 'vex-jamaah-detail',
  templateUrl: './jamaah-detail.component.html',
  styleUrls: ['./jamaah-detail.component.scss'],
  animations: [
    fadeInUp400ms,
    fadeInRight400ms,
    scaleIn400ms,
    stagger40ms
  ]
})
export class JamaahDetailComponent implements OnInit {

  icNumber = icNumber;
  faGender = faGender;
  faReligion = faReligion;
  icQuestion = icQuestion;
  icView = icView;
  icArrowBack = icArrowBack;
  icWork = icWork;
  icPhone = icPhone;
  icPersonAdd = icPersonAdd;
  icCheck = icCheck;
  icMail = icMail;
  icAccessTime = icAccessTime;
  icHome = icHome;
  icMap = icMap;

  model: Jamaah;

  constructor(private route: ActivatedRoute, private jamaahSvc: JamaahService) { }

  ngOnInit(): void {
    this.initModel();
  }

  private initModel() {
    this.route.paramMap
      .pipe(untilDestroyed(this))
      .subscribe(params => {
        const id = params.get('id');
        this.jamaahSvc.getById(id, 'contacts,details,families.residance.type,families.residance.address,families.members.relationship,families.members.jamaah').subscribe(g => {
          this.model = g.data;
        });
      });
  }
}
