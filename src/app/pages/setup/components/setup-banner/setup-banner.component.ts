import { Component, OnInit, ViewChild } from '@angular/core';

import icEdit from '@iconify/icons-ic/edit';
import icAdd from '@iconify/icons-ic/add-circle';
import icUp from '@iconify/icons-ic/baseline-arrow-circle-up';
import icDown from '@iconify/icons-ic/baseline-arrow-circle-down';
import icTrash from '@iconify/icons-ic/delete';

import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { finalize } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { SharedProperty } from 'src/app/types/shared-property.interface';
import { SharedPropertyService } from 'src/app/services/shared-property.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component';
import _ from 'lodash';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { GenericRs } from 'src/app/types/generic-rs.model';


@Component({
  selector: 'vex-setup-banner',
  templateUrl: './setup-banner.component.html',
  styleUrls: ['./setup-banner.component.scss'],
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class SetupBannerComponent implements OnInit {
  SHAREDPROP_GROUP = 'BANNER_IMAGE';

  icUp = icUp;
  icDown = icDown;
  icEdit = icEdit;
  icAdd = icAdd;
  icTrash = icTrash;

  isLoading = false;
  sharedPropsSubject$: BehaviorSubject<SharedProperty[]> = new BehaviorSubject([]);

  @ViewChild('fileInput') fileInput;

  constructor(
    private sharedPropSvc: SharedPropertyService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchModels();
  }

  fetchModels() {
    this.sharedPropSvc.findByGroup(this.SHAREDPROP_GROUP, 'banner')
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

  removeModel(model: SharedProperty) {
    if (!model.removable) { return; }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Apakah Anda ingin menghapus gambar <strong>${model.label}</strong>?`,
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
            _.remove(models, {id: model.id});
          });
      }
    });
  }

  pickNupload() {
    const fd = new FormData();
    this.isLoading = true;
    fd.append('image', this.fileInput.nativeElement.files[0]);

    this.sharedPropSvc.uploadImage(fd)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(rs => {
      const models = this.sharedPropsSubject$.getValue();
      models.push(rs.data);

      this.snackBar.openFromComponent(SnackbarNotifComponent, {data: {message: rs.message, type: 'success'}});
    }, (err: GenericRs<any>) => {
      this.snackBar.openFromComponent(SnackbarNotifComponent, {data: {message: err.message, type: 'danger'}});
    });
  }

}
