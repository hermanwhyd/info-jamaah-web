import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedPropertyService } from '../../../../services/shared-property.service';
import { BehaviorSubject } from 'rxjs';
import { SharedProperty } from 'src/app/types/shared-property.interface';

@Component({
  selector: 'vex-setup-iportal-info',
  templateUrl: './setup-iportal-info.component.html',
  styleUrls: ['./setup-iportal-info.component.scss']
})
export class SetupIportalInfoComponent implements OnInit {
  SHAREDPROP_GROUP = 'IPORTAL_INFO';

  form = this.fb.group({
    iPortalTagline: [''],
    iPortalDesc: [''],
    contactTelpValue: [''],
    contactTelpDesc: [''],
    contactEmailValue: [''],
    contactEmailDesc: [''],
  });

  sharedPropsSubject$: BehaviorSubject<SharedProperty[]> = new BehaviorSubject([]);

  constructor(private sharedPropSvc: SharedPropertyService, private cd: ChangeDetectorRef
            , private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.sharedPropSvc.findByGroup(this.SHAREDPROP_GROUP)
    .subscribe((rs) => {
      this.sharedPropsSubject$.next(rs.data);
      this.reset();
    });
  }

  get submitable(): boolean {
    return !this.form.pristine && this.form.valid;
  }

  get formControl() {
    return this.form.controls;
  }

  submit() {
    const form = this.form.value;
    const sharedProps = this.sharedPropsSubject$.getValue();
    sharedProps.find(s => s.code === 'TAGL').label = form.iPortalTagline;
    sharedProps.find(s => s.code === 'DESC').label = form.iPortalDesc;
    sharedProps.find(s => s.code === 'TELV').label = form.contactTelpValue;
    sharedProps.find(s => s.code === 'TELD').label = form.contactTelpDesc;
    sharedProps.find(s => s.code === 'IMLV').label = form.contactEmailValue;
    sharedProps.find(s => s.code === 'EMLD').label = form.contactEmailDesc;

    this.sharedPropSvc.update(sharedProps).subscribe((rs) => {
      if (rs.status === 'ok') {
        this.sharedPropsSubject$.next(sharedProps);
        this.reset();
        this.snackBar.openFromComponent(SnackbarNotifComponent, {data: {message: 'Informasi IPortal berhasil disimpan', type: 'success'}});
      } else {
        this.snackBar.openFromComponent(SnackbarNotifComponent, {data: {message: rs.data, type: 'danger'}});
      }
    });
  }

  reset() {
    const val = this.sharedPropsSubject$.getValue();
    this.form.patchValue({
      iPortalTagline: val.find(s => s.code === 'TAGL').label,
      iPortalDesc: val.find(s => s.code === 'DESC').label,
      contactTelpValue: val.find(s => s.code === 'TELV').label,
      contactTelpDesc: val.find(s => s.code === 'TELD').label,
      contactEmailValue: val.find(s => s.code === 'IMLV').label,
      contactEmailDesc: val.find(s => s.code === 'EMLD').label,
    });
    this.form.markAsPristine();
  }
}
