import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';

import { AssetMedia } from '../../../interfaces/asset.model';
import { SharedProperty } from 'src/app/shared/types/shared-property.interface';

@Component({
  selector: 'vex-asset-file-edit',
  templateUrl: './asset-file-edit.component.html',
  styleUrls: ['./asset-file-edit.component.scss']
})
export class AssetFileEditComponent implements OnInit {

  icMoreVert = icMoreVert;
  icClose = icClose;
  icDelete = icDelete;
  icDownload = icDownload;

  isNew = true;
  submitted = false;

  model: AssetMedia;
  collectionTypes: SharedProperty[];

  form = this.fb.group({
    uuid: null,
    name: ['', Validators.required],
    collectionName: ['', Validators.required],
    properties: this.fb.group({ notes: '' })
  });

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AssetFileEditComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.model = this.data.model;
    this.collectionTypes = this.data.collectionTypes;

    this.isNew = this.model.id == null;
    this.form.patchValue(this.model);
  }

  get submitable(): boolean {
    return !this.form.pristine && this.form.valid;
  }

  get formControl() {
    return this.form.controls;
  }

  get properties(): FormGroup {
    return this.form.get('properties') as FormGroup;
  }

  submit() {
    this.submitted = true;
    const form = this.form.getRawValue();
    this.model = {
      ...form
    };

    this.dialogRef.close({ action: 'save', model: this.model });
  }

  download() {
    this.dialogRef.close({ action: 'download', model: this.model });
  }
}
