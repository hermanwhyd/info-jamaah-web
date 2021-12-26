import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icDelete from '@iconify/icons-ic/twotone-delete';
import { AssetMaintenance, Location } from '../../../interfaces/asset.model';
import { SharedProperty } from 'src/app/shared/types/shared-property.interface';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/helpers/format-datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { SharedPropertyService } from 'src/app/shared/services/shared-property.service';

@Component({
  selector: 'vex-asset-audit-edit',
  templateUrl: './asset-audit-edit.component.html',
  styleUrls: ['./asset-audit-edit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
})
export class AssetAuditEditComponent implements OnInit {

  icMoreVert = icMoreVert;
  icClose = icClose;
  icDelete = icDelete;

  isNew = true;
  submitted = false;

  model: AssetMaintenance;
  statuses: SharedProperty[];
  locations: Location[];

  form = this.fb.group({
    id: null,
    assetId: ['', Validators.required],
    locationId: ['', Validators.required],
    assetStatusEnum: ['', Validators.required],
    notes: ['', Validators.maxLength(150)],
    auditedAt: ['', Validators.required]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AssetAuditEditComponent>,
    private fb: FormBuilder,
    private sharedPropSvc: SharedPropertyService) { }

  ngOnInit(): void {
    this.model = this.data.model;
    this.sharedPropSvc.getSelectOptions('location').subscribe(rs => this.locations = rs.data);
    this.sharedPropSvc.findByGroup('ASSET_STATUS').subscribe(rs => this.statuses = rs.data);

    this.isNew = this.model.id == null;
    this.form.patchValue(this.model);
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

    this.dialogRef.close(this.model);
  }

}
