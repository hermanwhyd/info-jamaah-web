import { Component, Inject, OnInit } from '@angular/core';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { Jamaah } from 'src/app/pages/jamaah/interfaces/jamaah.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icSearch from '@iconify/icons-ic/twotone-search';

import { PembinaService } from '../../pembina.service';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, finalize, tap } from 'rxjs/operators';
import { PengurusTable } from '../../pembina.interface';

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

  isFetch = false;
  isSubmit = {};
  jamaahList: Jamaah[];

  lvPembinaan: string;
  pembinaEnum: string;
  pengurusTable: PengurusTable;

  searchCtrl = new FormControl();
  searchStr$ = this.searchCtrl.valueChanges.pipe(
    debounceTime(100)
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private pembinaSvc: PembinaService
  ) {
    this.lvPembinaan = data.lvPembina;
    this.pembinaEnum = data.pembinaEnum;
    this.pengurusTable = data.pengurusTable;
  }

  ngOnInit(): void {
    this.searchStr$
      .pipe(tap(() => { this.jamaahList = []; }), filter<string>(Boolean))
      .subscribe(kw => {
        this.isFetch = true;
        this.pembinaSvc.getPengurusCandidate(this.pembinaEnum, kw, ['UBPK', 'UIBU'], this.pengurusTable.dapuan.code)
          .pipe(finalize(() => this.isFetch = false))
          .subscribe(data => {
            this.jamaahList = data.data;
          });
      });
  }

  trackByName(index: number, item: Jamaah) {
    return item.fullName;
  }

  addPengurus(model: Jamaah) {
    this.isSubmit[model.id] = true;

    this.pembinaSvc.addPengurus(this.pembinaEnum, this.pengurusTable.dapuan.code, model.id)
      .subscribe(data => {
        const idx = this.jamaahList.indexOf(model);
        this.jamaahList.splice(idx, 1);

        // Insert into current pengurus object
        if (!this.pengurusTable.pengurus) {
          this.pengurusTable.pengurus = [data.data];
        } else {
          this.pengurusTable.pengurus.push(data.data);
        }
      }, () => {
        this.isSubmit[model.id] = false;
      });
  }
}
