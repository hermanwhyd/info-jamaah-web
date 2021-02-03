import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';
import { Tag } from 'src/app/types/tag.interface';

@Component({
  selector: 'vex-setup-tag-edit',
  templateUrl: './setup-tag-edit.component.html',
  styleUrls: ['./setup-tag-edit.component.scss']
})
export class SetupTagEditComponent implements OnInit {
  isNew = true;
  submitted = false;

  icClose = icClose;

  model: Tag;

  form = this.fb.group({
    id: null,
    tag: ['', Validators.required],
    group: ['', Validators.required],
  });

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<SetupTagEditComponent>,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.model = {...this.data.model, group: this.data.group};
    console.log(this.model);
    this.form.patchValue(this.model);
    if (this.model.id) {
      this.isNew = false;
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
