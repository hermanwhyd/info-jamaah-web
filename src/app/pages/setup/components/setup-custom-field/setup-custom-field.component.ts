import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import icEdit from '@iconify/icons-ic/edit';
import icAdd from '@iconify/icons-ic/add-circle';
import icUp from '@iconify/icons-ic/baseline-arrow-circle-up';
import icDown from '@iconify/icons-ic/baseline-arrow-circle-down';
import icTrash from '@iconify/icons-ic/delete';
import icPlus from '@iconify/icons-ic/add';

import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { finalize } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/shared/utilities/confirmation-dialog/confirmation-dialog.component';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedPropertyService } from 'src/app/shared/services/shared-property.service';
import _ from 'lodash';
import { GenericRs } from 'src/app/shared/types/generic-rs.model';
import { SharedProperty } from 'src/app/shared/types/shared-property.interface';
import { SnackbarNotifComponent } from 'src/app/shared/utilities/snackbar-notif/snackbar-notif.component';
import { SetupEnumEditComponent } from '../setup-enum-edit/setup-enum-edit.component';
import { BehaviorSubject } from 'rxjs';
import { CustomField } from 'src/app/shared/types/custom-field.model';
import { SetupCustomFieldEditComponent } from './setup-custom-field-edit/setup-custom-field-edit.component';
import { CustomFieldService } from 'src/app/shared/services/custom-field.service';

@Component({
  selector: 'vex-setup-custom-field',
  templateUrl: './setup-custom-field.component.html',
  styleUrls: ['./setup-custom-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class SetupCustomFieldComponent implements OnInit {

  icUp = icUp;
  icDown = icDown;
  icEdit = icEdit;
  icAdd = icAdd;
  icTrash = icTrash;
  icPlus = icPlus;

  @Input() CUSTOMFIELD_GROUP: string;
  @Input() CUSTOMFIELD_DESC: string;
  @Input() CUSTOMFIELD_TITLE: string;

  groupEnumSubject = new BehaviorSubject<SharedProperty[]>([]);

  isLoading = false;

  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  constructor(
    private sharedPropSvc: SharedPropertyService,
    private customFieldSvc: CustomFieldService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchGroupEnum();
  }

  fetchGroupEnum() {
    this.isLoading = true;
    this.sharedPropSvc.findFullByGroup(this.CUSTOMFIELD_GROUP, 'customFields')
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((rs) => {
        this.groupEnumSubject.next(rs.data);
      });
  }

  swapPositionGroupEnum(idx: number, direction: string) {
    const models = this.groupEnumSubject.getValue();
    const idxOppst = direction === 'up' ? idx - 1 : idx + 1;
    const oppModel = models[idxOppst];
    const model = models[idx];
    [oppModel.position, model.position] = [model.position, oppModel.position];

    this.isLoading = true;
    this.sharedPropSvc.update([model, oppModel])
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(rs => {
        // Swap Local
        [models[idx], models[idxOppst]] = [oppModel, model];
      });
  }

  createOrUpdateGroupEnum(model?: SharedProperty, errors?: string[]) {
    this.dialog.open(SetupEnumEditComponent, {
      data: {
        model: model || {} as SharedProperty,
        group: this.CUSTOMFIELD_GROUP,
        errors
      },
      width: '500px',
      disableClose: true
    })
      .afterClosed().subscribe((newModel: SharedProperty) => {
        if (!newModel) { return; }

        // creation or update existing
        this.isLoading = true;
        this.sharedPropSvc.saveOrUpdate(newModel)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe(rs => {
            const models = this.groupEnumSubject.getValue();
            // Update or create
            if (model) {
              const index = _.findIndex(models, model);
              models[index] = { ...rs.data, customFields: model.customFields };
            } else {
              models.push({ ...rs.data, customFields: [] });
            }

            this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: rs.message, type: 'success' } });
          }, (err: GenericRs<any>) => {
            this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: err.message, type: 'danger' } });
            this.createOrUpdateGroupEnum(newModel);
          });
      });
  }

  removeGroupEnum(model: SharedProperty) {
    if (!model.removable) { return; }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Apakah Anda ingin menghapus seluruh custom field di grup <strong>${model.label}</strong>?`,
        buttonText: {
          ok: 'Ya',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.isLoading = true;
        this.sharedPropSvc.delete(model.id)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe(rs => {
            const models = this.groupEnumSubject.getValue();
            _.remove(models, { id: model.id });
          });
      }
    });
  }

  createOrUpdateCF(groupEnum: SharedProperty, model?: CustomField, errors?: string[]) {
    this.dialog.open(SetupCustomFieldEditComponent, {
      data: {
        model: model || { groupEnumId: groupEnum.id } as CustomField,
        errors
      },
      width: '500px',
      disableClose: true
    })
      .afterClosed().subscribe((newModel: CustomField) => {
        if (!newModel) { return; }

        // creation or update existing
        this.isLoading = true;
        this.customFieldSvc.saveOrUpdate(newModel)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe(rs => {
            // Update or create
            if (model) {
              const index = _.findIndex(groupEnum.customFields, model);
              groupEnum.customFields[index] = rs.data;
            } else {
              groupEnum.customFields.push(rs.data);
            }

            this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: rs.message, type: 'success' } });
          }, (err: GenericRs<any>) => {
            this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: err.message, type: 'danger' } });
            this.createOrUpdateCF(groupEnum, newModel);
          });
      });
  }

  swapPositionCF(groupEnum: SharedProperty, idx: number, direction: string) {
    const models = groupEnum.customFields;
    const idxOppst = direction === 'up' ? idx - 1 : idx + 1;
    const oppModel = models[idxOppst];
    const model = models[idx];
    [oppModel.position, model.position] = [model.position, oppModel.position];

    this.isLoading = true;
    this.customFieldSvc.update([model, oppModel])
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(rs => {
        // Swap Local
        [models[idx], models[idxOppst]] = [oppModel, model];
      });
  }

  removeCF(groupEnum: SharedProperty, model: CustomField) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Apakah Anda ingin menghapus custom field <strong>${model.fieldName}</strong>?`,
        buttonText: {
          ok: 'Ya',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.isLoading = true;
        this.customFieldSvc.delete(model.id)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe(rs => {
            const models = groupEnum.customFields;
            _.remove(models, { id: model.id });
          });
      }
    });
  }

}
