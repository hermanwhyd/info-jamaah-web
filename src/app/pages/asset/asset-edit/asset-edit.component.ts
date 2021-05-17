import { Component, OnInit } from '@angular/core';
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

@UntilDestroy()
@Component({
  selector: 'vex-asset-edit',
  templateUrl: './asset-edit.component.html',
  styleUrls: ['./asset-edit.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class AssetEditComponent implements OnInit {

  icBack = icBack;

  model: Asset;
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
          this.assetSvc.getById(id)
            .pipe(tap((gr) => {
              this.isNew = true;
              this.form.patchValue(gr.data);
            })).subscribe(gr => {
              this.model = gr.data;
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
}
