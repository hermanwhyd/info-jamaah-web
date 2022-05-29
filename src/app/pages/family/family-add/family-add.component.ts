import { Component, OnInit } from '@angular/core';

import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icDelete from '@iconify/icons-ic/twotone-delete';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedProperty } from 'src/app/shared/types/shared-property.interface';
import { Jamaah } from '../../jamaah/shared/interfaces/jamaah.model';
import { SharedPropertyService } from 'src/app/shared/services/shared-property.service';

@Component({
  selector: 'vex-family-add',
  templateUrl: './family-add.component.html',
  styleUrls: ['./family-add.component.scss']
})
export class FamilyAddComponent implements OnInit {
  icMoreVert = icMoreVert;
  icClose = icClose;
  icDelete = icDelete;

  pembinaList: SharedProperty[] = [];
  jamaahList: Jamaah[] = [];

  form = this.fb.group({
    label: ['', [Validators.required, Validators.minLength(2)]],
    kepalaKeluargaId: ['', [Validators.required]],
    pembinaEnum: ['', Validators.required],
  });

  constructor(
    private dialogRef: MatDialogRef<FamilyAddComponent>,
    private fb: FormBuilder,
    private sharedPropertyService: SharedPropertyService) { }

  ngOnInit(): void {
    this.sharedPropertyService.getSelectOptions('pembina').subscribe(rs => {
      this.pembinaList = rs.data;
    });

    this.sharedPropertyService.getSelectOptions('jamaah', { name: '' }).subscribe(rs => {
      this.jamaahList = rs.data;
    });
  }

  get submitable(): boolean {
    return !this.form.pristine && this.form.valid;
  }

  get formControl() {
    return this.form.controls;
  }

  submit() {
    this.dialogRef.close(this.form.getRawValue());
  }

}
