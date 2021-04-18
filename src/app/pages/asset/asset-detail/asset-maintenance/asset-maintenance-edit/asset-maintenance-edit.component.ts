import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icDelete from '@iconify/icons-ic/twotone-delete';
import { AssetMaintenance, Supplier } from '../../../interfaces/asset.model';
import { compareObjectId } from 'src/app/utilities/function/comparator';

@Component({
  selector: 'vex-asset-maintenance-edit',
  templateUrl: './asset-maintenance-edit.component.html',
  styleUrls: ['./asset-maintenance-edit.component.scss']
})
export class AssetMaintenanceEditComponent implements OnInit {

  icMoreVert = icMoreVert;
  icClose = icClose;
  icDelete = icDelete;

  compareObjectId = compareObjectId;

  isNew = true;
  submitted = false;

  model: AssetMaintenance;
  suppliers: Supplier[];

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

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AssetMaintenanceEditComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.model = this.data.model;
    this.suppliers = this.data.suppliers;

    if (this.model.id) {
      this.isNew = true;
      this.form.patchValue(this.model);
    }
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
