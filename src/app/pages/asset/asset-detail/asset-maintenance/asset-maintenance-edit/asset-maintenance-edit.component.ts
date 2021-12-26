import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import icClose from '@iconify/icons-ic/twotone-close';

import { AssetMaintenance, Supplier } from '../../../interfaces/asset.model';
import { SharedProperty } from 'src/app/shared/types/shared-property.interface';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/helpers/format-datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { SharedPropertyService } from 'src/app/shared/services/shared-property.service';

@Component({
  selector: 'vex-asset-maintenance-edit',
  templateUrl: './asset-maintenance-edit.component.html',
  styleUrls: ['./asset-maintenance-edit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
})
export class AssetMaintenanceEditComponent implements OnInit {

  icClose = icClose;

  isNew = true;
  submitted = false;

  model: AssetMaintenance;
  suppliers: Supplier[];
  types: SharedProperty[];

  form = this.fb.group({
    id: null,
    assetId: ['', Validators.required],
    supplierId: ['', Validators.required],
    title: ['', Validators.required],
    typeEnum: ['', Validators.required],
    notes: ['', Validators.maxLength(150)],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AssetMaintenanceEditComponent>,
    private fb: FormBuilder,
    private sharedPropSvc: SharedPropertyService) { }

  ngOnInit(): void {
    this.model = this.data.model;
    this.sharedPropSvc.getSelectOptions('vendor').subscribe(rs => this.suppliers = rs.data);
    this.sharedPropSvc.findByGroup('MAINTENANCE_TYPE').subscribe(rs => this.types = rs.data);

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
