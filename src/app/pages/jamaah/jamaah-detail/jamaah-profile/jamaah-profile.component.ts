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
import icCamera from '@iconify/icons-ic/baseline-photo-camera';
import icUploadPhoto from '@iconify/icons-ic/baseline-photo-camera';
import icViewPhoto from '@iconify/icons-ic/baseline-photo-camera';

import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Jamaah } from '../../shared/interfaces/jamaah.model';
import { JamaahService } from '../../shared/services/jamaah.service';
import { SharedProperty } from 'src/app/shared/types/shared-property.interface';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { JamaahUploadComponent } from './jamaah-upload/jamaah-upload.component';
import { MatDialog } from '@angular/material/dialog';

@UntilDestroy()
@Component({
  selector: 'vex-jamaah-profile',
  templateUrl: './jamaah-profile.component.html',
  styleUrls: ['./jamaah-profile.component.scss'],
  animations: [
    fadeInUp400ms,
    fadeInRight400ms,
    scaleIn400ms,
    stagger40ms
  ]
})
export class JamaahProfileComponent implements OnInit {

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
  icCamera = icCamera;
  icViewPhoto = icViewPhoto;
  icUploadPhoto = icUploadPhoto;

  model: Jamaah;
  jamaahDetails: SharedProperty[];

  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private jamaahSvc: JamaahService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initModel();
  }

  private initModel() {
    this.route.paramMap
      .pipe(untilDestroyed(this))
      .subscribe(params => {
        this.isLoading = true;
        this.jamaahDetails = [];
        this.model = null;
        const id = params.get('id');
        forkJoin([
          this.jamaahSvc.getDetail(id, { params: { mode: 'view' } }),
          this.jamaahSvc.getById(id, 'contacts,families.residance.type,families.residance.address,families.members.relationship,families.members.jamaah')
        ])
          .pipe(finalize(() => this.isLoading = false)).subscribe(rs => {
            this.jamaahDetails = rs[0].data;
            this.model = rs[1].data;
          });
      });
  }

  get jamaahDetailOdds() {
    return this.jamaahDetails.filter((e, i) => ++i % 2 !== 0);
  }

  get jamaahDetailEvens() {
    return this.jamaahDetails.filter((e, i) => ++i % 2 === 0);
  }

  uploadFile() {
    this.dialog.open(JamaahUploadComponent, {
      data: {
        model: this.model,
      },
      width: '450px',
    });
  }

}
