import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import icClose from '@iconify/icons-ic/twotone-close';
import icCancel from '@iconify/icons-ic/cancel';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { CustomField } from 'src/app/types/custom-field.model';

@Component({
  selector: 'vex-setup-custom-field-edit',
  templateUrl: './setup-custom-field-edit.component.html',
  styleUrls: ['./setup-custom-field-edit.component.scss']
})
export class SetupCustomFieldEditComponent implements OnInit {

  isNew = true;
  submitted = false;

  icClose = icClose;
  icCancel = icCancel;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  model: CustomField;
  fieldTypes = ['text', 'enum', 'date', 'shared-property'];
  references: string[];

  form = this.fb.group({
    id: null,
    groupEnumId: ['', Validators.required],
    position: [''],
    fieldName: ['', Validators.required],
    fieldType: ['', Validators.required],
    fieldReference: [''],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<SetupCustomFieldEditComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.model = { ...this.data.model };
    this.form.patchValue(this.model);
    this.isNew = this.model?.id === undefined;
    this.references = this.model?.fieldReference?.split(',') ?? [];
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

  addRefChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const input = event.input;

    // Add our chip
    if (value) {
      this.references.push(value);
    }

    // Clear the input value
    if (input) {
      input.value = '';
    }
    // event.chipInput!.clear();

    //  Set to fieldReference
    this.form.get('fieldReference').setValue(this.references.join(','));
    this.form.get('fieldReference').markAsDirty();
  }

  removeRefChip(item: string): void {
    const index = this.references.indexOf(item);

    if (index >= 0) {
      this.references.splice(index, 1);
    }

    //  Set to fieldReference
    this.form.get('fieldReference').setValue(this.references.join(','));
    this.form.get('fieldReference').markAsDirty();
  }
}
