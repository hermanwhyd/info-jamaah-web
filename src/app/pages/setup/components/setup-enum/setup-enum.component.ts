import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/services/shared-property.service';
import { GenericRs } from 'src/app/shared/types/generic-rs.model';
import { SharedProperty } from 'src/app/shared/types/shared-property.interface';
import { SnackbarNotifComponent } from 'src/app/shared/utilities/snackbar-notif/snackbar-notif.component';
import { SetupEnumEditComponent } from '../setup-enum-edit/setup-enum-edit.component';

import icEdit from '@iconify/icons-ic/edit';
import icAdd from '@iconify/icons-ic/add-circle';
import icUp from '@iconify/icons-ic/baseline-arrow-circle-up';
import icDown from '@iconify/icons-ic/baseline-arrow-circle-down';
import icTrash from '@iconify/icons-ic/delete';

import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { finalize } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/shared/utilities/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'vex-setup-enum',
  templateUrl: './setup-enum.component.html',
  styleUrls: ['./setup-enum.component.scss'],
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class SetupEnumComponent implements OnInit {
  @Input() GROUP: string;
  @Input() DESCRIPTION: string;
  @Input() TITLE: string;

  icUp = icUp;
  icDown = icDown;
  icEdit = icEdit;
  icAdd = icAdd;
  icTrash = icTrash;

  isLoading = false;
  sharedPropsSubject$: BehaviorSubject<SharedProperty[]> = new BehaviorSubject([]);

  constructor(
    private sharedPropSvc: SharedPropertyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private elRef: ElementRef) { }

  ngOnInit(): void {
    this.fetchModels();
  }

  scrollIntoView(opt?: any) {
    this.elRef.nativeElement.scrollIntoView(opt || { block: 'start', behavior: 'smooth' });
  }

  fetchModels() {
    this.isLoading = true;
    this.sharedPropSvc.findFullByGroup(this.GROUP)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((rs) => {
        this.sharedPropsSubject$.next(rs.data);
      });
  }

  swapPosition(idx: number, direction: string) {
    const models = this.sharedPropsSubject$.getValue();
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

  createOrUpdateModel(model?: SharedProperty, errors?: string[]) {
    this.dialog.open(SetupEnumEditComponent, {
      data: {
        model: model || {} as SharedProperty,
        group: this.GROUP,
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
            const models = this.sharedPropsSubject$.getValue();
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
            this.createOrUpdateModel(newModel);
          });
      });
  }

  removeModel(model: SharedProperty) {
    if (!model.removable) { return; }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Apakah Anda ingin menghapus property <strong>${model.label}</strong>?`,
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
            const models = this.sharedPropsSubject$.getValue();
            _.remove(models, { id: model.id });
          });
      }
    });
  }
}
