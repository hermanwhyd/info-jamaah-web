import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import icEdit from '@iconify/icons-ic/edit';
import icAdd from '@iconify/icons-ic/add-circle';
import icUp from '@iconify/icons-ic/baseline-arrow-circle-up';
import icDown from '@iconify/icons-ic/baseline-arrow-circle-down';
import icTrash from '@iconify/icons-ic/delete';

import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { finalize } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedPropertyService } from 'src/app/services/shared-property.service';
import _ from 'lodash';
import { GenericRs } from 'src/app/types/generic-rs.model';
import { SharedProperty } from 'src/app/types/shared-property.interface';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { SetupEnumEditComponent } from '../setup-enum-edit/setup-enum-edit.component';
import { BehaviorSubject } from 'rxjs';

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

  SHAREDPROP_GROUP = 'CUSTOM_FIELD_ASSET';
  groupEnumSubject = new BehaviorSubject<SharedProperty[]>([]);

  isLoading = false;

  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  constructor(
    private sharedPropSvc: SharedPropertyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchGroupEnum();
  }

  fetchGroupEnum() {
    this.isLoading = true;
    this.sharedPropSvc.findFullByGroup(this.SHAREDPROP_GROUP, 'customFields')
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
        group: this.SHAREDPROP_GROUP,
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
              models[index] = rs.data;
            } else {
              models.push(rs.data);
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
}
