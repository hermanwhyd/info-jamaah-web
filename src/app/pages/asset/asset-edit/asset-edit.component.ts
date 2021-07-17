import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, tap } from 'rxjs/operators';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger60ms } from 'src/@vex/animations/stagger.animation';
import { SharedProperty } from 'src/app/types/shared-property.interface';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { Asset, Location } from '../interfaces/asset.model';
import { AssetService } from '../service/asset.service';
import icBack from '@iconify/icons-ic/chevron-left';
import { MatAccordion } from '@angular/material/expansion';
import { forkJoin } from 'rxjs';
import { AdditionalField } from 'src/app/types/additional-field.interface';
import { CustomField } from 'src/app/types/custom-field.model';
import { SharedPropertyService } from 'src/app/services/shared-property.service';
import _ from 'lodash';

@UntilDestroy()
@Component({
  selector: 'vex-asset-edit',
  templateUrl: './asset-edit.component.html',
  styleUrls: ['./asset-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class AssetEditComponent implements OnInit {

  icBack = icBack;

  model: Asset;
  assetDetail: SharedProperty[];
  locations: any;
  pembinas: SharedProperty[];
  categories: SharedProperty[];
  statuses: SharedProperty[];

  isNew = true;
  submitted = false;
  isFetching = true;
  isSubmitting = false;

  form = this.fb.group({
    id: null,
    title: ['', Validators.required],
    tagNo: [''],
    categoryEnum: ['', Validators.required],
    statusEnum: ['', Validators.required],
    locationId: ['', Validators.required],
    pembinaEnum: ['', Validators.required],
  });

  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private enumSvc: SharedPropertyService,
    private assetSvc: AssetService) { }

  ngOnInit(): void {
    this.initModel();
  }

  private initModel() {
    this.route.paramMap
      .pipe(untilDestroyed(this))
      .subscribe(params => {
        const id = params.get('id');

        // fetch required data
        const callCategories = this.enumSvc.findByGroup('ASSET_CATEGORY');
        const callStatuses = this.enumSvc.findByGroup('ASSET_STATUS');
        const callLocations = this.enumSvc.getSelectOptions('location', { include: 'type' });
        const callPembinas = this.enumSvc.getSelectOptions('pembina');

        const arr = [callCategories, callStatuses, callLocations, callPembinas];
        if (id) {
          const callAset = this.assetSvc.getById(id).pipe(tap((gr) => {
            this.isNew = false;
            this.form.patchValue(gr.data);
          }));
          const callAssetDetail = this.assetSvc.getDetail(id);
          arr.push(callAset, callAssetDetail);
        }

        const multiCall = forkJoin(arr);
        multiCall.pipe(finalize(() => this.isFetching = false)).subscribe(res => {
          this.categories = res[0].data;
          this.statuses = res[1].data;
          this.locations = _.groupBy(res[2].data, 'type.label');
          this.pembinas = res[3].data;

          if (res.length > 4) {
            this.model = res[4].data;
            this.assetDetail = res[5].data;
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

    this.assetSvc.saveOrUpdate(this.model)
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
    this.assetSvc.createDetail(this.model.id, detail)
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
