import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../interfaces/user.interface';

import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icDelete from '@iconify/icons-ic/twotone-delete';

@Component({
  selector: 'vex-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  isNew = true;
  submitted = false;

  roleList: string[] = ['ADMIN', 'PEGAWAI'];

  fpassword = {placeholder: '', floatLabel: 'auto'};
  form = this.fb.group({
    id: null,
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    roles: ['', Validators.required],
  });

  user: User;

  icMoreVert = icMoreVert;
  icClose = icClose;
  icDelete = icDelete;

  constructor(@Inject(MAT_DIALOG_DATA) private _user: User,
              private dialogRef: MatDialogRef<UserEditComponent>,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.user = this._user;
    if (this._user.id) {
      this.isNew = false;
      this.form.patchValue(this.user);
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
    this.user = {
      ...form
      , id: this.user.id
    };

    this.dialogRef.close(this.user);
  }
}
