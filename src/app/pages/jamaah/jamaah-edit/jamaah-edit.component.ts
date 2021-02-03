import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Jamaah } from '../interfaces/jamaah.model';

import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icDelete from '@iconify/icons-ic/twotone-delete';

@Component({
  selector: 'vex-jamaah-edit',
  templateUrl: './jamaah-edit.component.html',
  styleUrls: ['./jamaah-edit.component.scss']
})
export class JamaahEditComponent implements OnInit {
  isNew = true;
  submitted = false;

  roleList: string[] = ['ADMIN', 'PEGAWAI'];

  fpassword = {placeholder: '', floatLabel: 'auto'};
  form = this.fb.group({
    id: null,
    nip: ['', [Validators.required, Validators.pattern('^[0-9]{18}$')]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    roles: ['', Validators.required],
  });

  jamaah: Jamaah;

  icMoreVert = icMoreVert;
  icClose = icClose;
  icDelete = icDelete;

  constructor(@Inject(MAT_DIALOG_DATA) private _jamaah: Jamaah,
              private dialogRef: MatDialogRef<JamaahEditComponent>,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.jamaah = this._jamaah;
    if (this._jamaah.id) {
      this.isNew = false;
      this.form.patchValue(this.jamaah);
      this.form.get('password').setValidators([]);
      this.fpassword = {placeholder: '(tidak diubah)', floatLabel: 'always'};
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
    this.jamaah = {
      ...form
      , id: this.jamaah.id
    };

    this.dialogRef.close(this.jamaah);
  }
}
