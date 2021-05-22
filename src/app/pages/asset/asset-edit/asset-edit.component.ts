import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs/operators';
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
  locations: Location[];
  categories: SharedProperty[];
  statuses: SharedProperty[];

  isNew = true;
  submitted = false;

  form = this.fb.group({
    id: null,
    title: ['', Validators.required],
    tagNo: [''],
    categoryEnum: ['', Validators.required],
    statusEnum: ['', Validators.required],
    locationId: ['', Validators.required],
    ownerEnum: ['', Validators.required],
  });

  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private assetSvc: AssetService) { }

  ngOnInit(): void {
    this.initModel();
  }

  private initModel() {
    this.route.paramMap
      .pipe(untilDestroyed(this))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          const callAsset = this.assetSvc.getById(id).pipe(tap((gr) => {
            this.isNew = true;
            this.form.patchValue(gr.data);
          }));
          const callAssetDetail = this.assetSvc.getDetail(id);

          const multiCall = forkJoin([callAsset, callAssetDetail]);
          multiCall.subscribe(res => {
            this.model = res[0].data;
            this.assetDetail = res[1].data;
          });
        }
      });
  }

  get submitable(): boolean {
    return !this.form.pristine && this.form.valid;
  }

  get formControl() {
    return this.form.controls;
  }

  submit() {
    this.submitted = true;
    const form = this.form.getRawValue();
    this.model = {
      ...form
      , id: this.model.id
    };

    this.assetSvc.saveOrUpdate(this.model)
      .subscribe({
        next: data => {
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

  onSaveDetail(detail: AdditionalField, cf: CustomField) {
    this.assetSvc.createDetail(this.model.id, detail)
      .subscribe({
        next: gr => cf.value = gr.data,
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
