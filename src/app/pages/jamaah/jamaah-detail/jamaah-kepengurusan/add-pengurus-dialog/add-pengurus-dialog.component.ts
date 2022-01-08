import { Component, Inject, OnInit } from '@angular/core';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { JamaahPengurus } from 'src/app/pages/jamaah/shared/interfaces/jamaah.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icSearch from '@iconify/icons-ic/twotone-search';
import icClose from '@iconify/icons-ic/twotone-close';

import { finalize } from 'rxjs/operators';
import { PembinaService } from 'src/app/pages/pembina/shared/pembina.service';
import { SharedProperty } from 'src/app/shared/types/shared-property.interface';
import { SharedPropertyService } from 'src/app/shared/services/shared-property.service';
import { BehaviorSubject } from 'rxjs';
import { Kepengurusan } from 'src/app/pages/pembina/shared/kepengurusan.interface';

@Component({
  selector: 'vex-add-pengurus-dialog',
  templateUrl: './add-pengurus-dialog.component.html',
  styleUrls: ['./add-pengurus-dialog.component.scss'],
  animations: [
    fadeInUp400ms,
    fadeInRight400ms,
    scaleIn400ms,
    stagger40ms
  ]
})
export class AddPengurusDialogComponent implements OnInit {

  icPersonAdd = icPersonAdd;
  icSearch = icSearch;
  icClose = icClose;

  isFetch = true;
  isSubmit = {};

  pengurusList: SharedProperty[];

  jamaahId: number;
  jamaahPengurus: JamaahPengurus;
  kepengurusanSubject: BehaviorSubject<Kepengurusan[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private sharedPropSvc: SharedPropertyService,
    private pembinaSvc: PembinaService
  ) {
    this.jamaahId = data.jamaahId;
    this.jamaahPengurus = data.jamaahPengurus;
    this.kepengurusanSubject = data.kepengurusanSubject;
  }

  ngOnInit(): void {
    this.isFetch = true;
    this.pengurusList = [];
    this.sharedPropSvc.findByGroup('DAPUKAN_' + this.jamaahPengurus.lvPembinaEnum)
      .pipe(finalize(() => this.isFetch = false))
      .subscribe(data => {
        this.pengurusList = data.data;
      });
  }

  get getCandidate() {
    return this.pengurusList.filter(f => !this.jamaahPengurus.pengurus?.some(s => s.dapukan.code === f.code));
  }

  addPengurus(model: SharedProperty) {
    this.isSubmit[model.code] = true;

    this.pembinaSvc.addPengurus(this.jamaahPengurus.pembina.code, model.code, this.jamaahId)
      .pipe(finalize(() => this.isSubmit[model.code] = false))
      .subscribe(data => {
        const idx = this.pengurusList.indexOf(model);
        this.pengurusList.splice(idx, 1);

        // Insert into current pengurus object
        const models = this.kepengurusanSubject.value || [];
        models.push(data.data);

        this.kepengurusanSubject.next(models);
      });
  }
}
