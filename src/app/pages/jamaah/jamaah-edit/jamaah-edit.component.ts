import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, tap } from 'rxjs/operators';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger60ms } from 'src/@vex/animations/stagger.animation';
import { SharedProperty } from 'src/app/shared/types/shared-property.interface';
import { SnackbarNotifComponent } from 'src/app/shared/utilities/snackbar-notif/snackbar-notif.component';

import icBack from '@iconify/icons-ic/chevron-left';
import { MatAccordion } from '@angular/material/expansion';
import { forkJoin } from 'rxjs';
import { AdditionalField } from 'src/app/shared/types/additional-field.interface';
import { CustomField } from 'src/app/shared/types/custom-field.model';
import { SharedPropertyService } from 'src/app/shared/services/shared-property.service';
import _ from 'lodash';
import { Jamaah } from '../shared/interfaces/jamaah.model';
import { JamaahService } from '../shared/services/jamaah.service';

@UntilDestroy()
@Component({
  selector: 'vex-jamaah-edit',
  templateUrl: './jamaah-edit.component.html',
  styleUrls: ['./jamaah-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class JamaahEditComponent implements OnInit {

  icBack = icBack;

  model: Jamaah;
  jamaahDetail: SharedProperty[];
  pembinas: SharedProperty[];
  lvPembinaans: SharedProperty[];

  isNew = true;
  submitted = false;
  isFetching = true;
  isSubmitting = false;

  form = this.fb.group({
    id: null,
    fullName: ['', Validators.required],
    nickname: ['', Validators.required],
    gender: ['', Validators.required],
    birthDate: ['', Validators.required],
    pembinaEnum: ['', Validators.required],
    lvPembinaanEnum: ['', Validators.required],
  });

  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private enumSvc: SharedPropertyService,
    private jamaahSvc: JamaahService) { }

  ngOnInit(): void {
    this.initModel();
  }

  private initModel() {
    this.route.paramMap
      .pipe(untilDestroyed(this))
      .subscribe(params => {
        const id = params.get('id');

        // fetch required data
        const callLvPembinaans = this.enumSvc.findByGroup('LV_PEMBINAAN');
        const callPembinas = this.enumSvc.getSelectOptions('pembina');

        const arr = [callLvPembinaans, callPembinas];
        if (id) {
          const callJamaah = this.jamaahSvc.getById(id).pipe(tap((gr) => {
            this.isNew = false;
            this.form.patchValue(gr.data);
          }));
          const callJamaahDetail = this.jamaahSvc.getDetail(id);
          arr.push(callJamaah, callJamaahDetail);
        }

        forkJoin(arr)
          .pipe(finalize(() => this.isFetching = false))
          .subscribe(res => {
            this.lvPembinaans = res[0].data;
            this.pembinas = res[1].data;

            if (res.length > 2) {
              this.model = res[2].data;
              this.jamaahDetail = res[3].data;
            }
          });
      });
  }

  get submitable(): boolean {
    return !this.form.pristine && this.form.valid;
  }

  get resetable(): boolean {
    return this.form.dirty;
  }

  get formControl() {
    return this.form.controls;
  }

  reset() {
    this.form.reset(this.model);
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  submit() {
    this.isSubmitting = true;
    const form = this.form.getRawValue();
    this.model = {
      ...form
      , id: this.model?.id
    };

    this.jamaahSvc.saveOrUpdate(this.model)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: gr => {
          this.submitted = true;
          this.reset();
          this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: 'Berhasil menyimpan data!', type: 'success' } });
          if (this.isNew) {
            this.router.navigate([gr.data.id], { relativeTo: this.route });
          }
        },
        error: err => {
          this.snackBar.openFromComponent(SnackbarNotifComponent, {
            data: {
              message: err.message || 'Gagal menyimpan data!', type: 'danger'
            }
          });
        }
      });
  }

  onSaveDetail(detail: AdditionalField, cf: CustomField) {
    this.jamaahSvc.createDetail(this.model.id, detail)
      .subscribe({
        next: gr => {
          cf.value = gr.data;
          this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: 'Berhasil menyimpan data!', type: 'success' } });
        },
        error: err => {
          this.snackBar.openFromComponent(SnackbarNotifComponent, {
            data: {
              message: err.message || 'Gagal menyimpan data!', type: 'danger'
            }
          });
        }
      });
  }
}
