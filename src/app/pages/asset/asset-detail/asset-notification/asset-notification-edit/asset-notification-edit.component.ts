import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import icClose from '@iconify/icons-ic/twotone-close';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import icDelete from '@iconify/icons-ic/round-cancel';
import icNotifAdd from '@iconify/icons-ic/sharp-notification-add';
import icNotifActive from '@iconify/icons-ic/outline-notifications-active';

import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/helpers/format-datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Notifier } from 'src/app/types/notifier.interface';
import { SharedPropertyService } from 'src/app/services/shared-property.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { AdditionalField } from 'src/app/types/additional-field.interface';
import { compareObjectId } from 'src/app/utilities/function/comparator';
import { finalize } from 'rxjs/operators';
import { AssetService } from '../../../service/asset.service';
import { Subscription } from 'src/app/types/subscription.interface';

import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { SharedProperty } from 'src/app/types/shared-property.interface';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'vex-asset-notification-edit',
  templateUrl: './asset-notification-edit.component.html',
  styleUrls: ['./asset-notification-edit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
  animations: [
    fadeInUp400ms,
    fadeInRight400ms,
    scaleIn400ms,
    stagger40ms
  ]
})
export class AssetNotificationEditComponent implements OnInit {

  compareObjectId = compareObjectId;

  icClose = icClose;
  icDoneAll = icDoneAll;
  icDelete = icDelete;
  icNotifAdd = icNotifAdd;
  icNotifActive = icNotifActive;

  isNew = true;
  submitted = false;

  isSubsLoading = [] as boolean[];

  isUseReferable = false;
  assetId: number;
  model: Notifier;
  referables: AdditionalField[];
  subscriptions = [] as Subscription[];

  form: FormGroup;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private sharedPropSvc: SharedPropertyService,
    private assetSvc: AssetService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AssetNotificationEditComponent>,) { }

  ngOnInit(): void {
    this.initModel();
    this.initForm();
  }

  private initModel(): void {
    this.model = this.data.model;
    this.assetId = this.data.assetId;
    this.isNew = this.model.id == null;
    this.isUseReferable = this.model.referable != null || false;
    this.sharedPropSvc.getSelectOptions('asset-af', { id: this.assetId }).subscribe(rs => this.referables = rs.data);
    this.sharedPropSvc.getSelectOptions('pengrs-wc').subscribe(rs => {
      const subscrs = this.model?.subscriptions;
      rs.data.forEach((d: SharedProperty) => {
        const e = subscrs?.find(sub => sub.subscriber?.id === d.id);
        const s = { id: e?.id, subscriber: d } as Subscription;
        this.subscriptions.push(s);
        this.isSubsLoading.push(false);
      });
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      id: [],
      name: [null, Validators.required],
      description: [],
      isRepetition: [false, Validators.required],
      reminderDays: [[], Validators.required],
      referable: [],
      dueDateAt: [{ value: null, disabled: this.isUseReferable }, Validators.required],
    });

    if (!this.isNew) {
      this.form.patchValue({ ...this.model, reminderDays: [... this.model.reminderDays] });
    }

    this.form.valueChanges.pipe(finalize(() => this.submitted = false));
  }

  get submitable(): boolean {
    return !this.form.pristine && this.form.valid;
  }

  get nextable(): boolean {
    return (this.submitted && !this.isNew) || (this.form.valid && this.form.pristine);
  }

  get formControl() {
    return this.form.controls;
  }

  get reminderDays() {
    return this.form.get('reminderDays');
  }

  submit() {
    const form = this.form.getRawValue();
    this.assetSvc.saveOrUpdateNotifier(form, this.assetId)
      .pipe(finalize(() => this.submitted = true))
      .subscribe(rs => {
        this.isNew = false;
        this.model = { ...form, id: rs.data.id, subscriptions: this.subscriptionUpdated };
        this.formControl.id.setValue(rs.data.id);
        this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: 'Data berhasil disimpan', type: 'success' } });
        this.reset();
      });
  }

  reset() {
    this.form.reset({ ...this.model, reminderDays: [... this.model.reminderDays] });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  close() {
    this.model.subscriptions = this.subscriptionUpdated;
    this.dialogRef.close(this.model);
  }

  get subscriptionUpdated() {
    return this.subscriptions?.filter(s => s.id != null);
  }

  addReminderDay(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const day = 'H-' + value.trim();
      const index = this.reminderDays.value.indexOf(day);
      if (index < 0) {
        this.reminderDays.value.push(day);
        this.reminderDays.updateValueAndValidity();
        this.form.markAsDirty();
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeReminderDay(value: string): void {
    const index = this.reminderDays.value.indexOf(value);

    if (index >= 0) {
      this.reminderDays.value.splice(index, 1);
      this.reminderDays.updateValueAndValidity();
      this.form.markAsDirty();
    }
  }

  changeReferable(e: any) {
    if (e.value) {
      this.isUseReferable = true;
      this.formControl.dueDateAt.setValue(e.value?.value);
      this.formControl.dueDateAt.disable();
    } else {
      this.isUseReferable = false;
      this.formControl.dueDateAt.reset();
      this.formControl.dueDateAt.enable();
    }
  }

  subscribe(idx: number, s: Subscription) {
    this.isSubsLoading[idx] = true;
    this.assetSvc.subscribeNotifier(this.model.id, s)
      .pipe(finalize((() => this.isSubsLoading[idx] = false)))
      .subscribe(rs => {
        s.id = rs.data.id;
      });
  }

  unsubscriber(idx: number, s: Subscription) {
    this.isSubsLoading[idx] = true;
    this.assetSvc.unsubscribeNotifier(this.model.id, s.id)
      .pipe(finalize((() => this.isSubsLoading[idx] = false)))
      .subscribe(rs => {
        s.id = null;
      });
  }
}
