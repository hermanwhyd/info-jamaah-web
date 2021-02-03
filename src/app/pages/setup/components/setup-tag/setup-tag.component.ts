import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { GenericRs } from 'src/app/types/generic-rs.model';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';

import icEdit from '@iconify/icons-ic/edit';
import icAdd from '@iconify/icons-ic/add-circle';
import icTrash from '@iconify/icons-ic/delete';

import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { finalize } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component';
import { Tag } from 'src/app/types/tag.interface';
import { TagService } from 'src/app/services/tag.service';
import { SetupTagEditComponent } from '../setup-tag-edit/setup-tag-edit.component';

@Component({
  selector: 'vex-setup-tag',
  templateUrl: './setup-tag.component.html',
  styleUrls: ['./setup-tag.component.scss'],
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class SetupTagComponent implements OnInit {
  @Input() TAG_GROUP: string;
  @Input() TAG_DESC: string;
  @Input() TAG_TITLE: string;

  icEdit = icEdit;
  icAdd = icAdd;
  icTrash = icTrash;

  isLoading = false;
  tagsSubject$: BehaviorSubject<Tag[]> = new BehaviorSubject([]);

  constructor(
    private tagSvc: TagService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchModels();
  }

  fetchModels() {
    this.tagSvc.findByGroup(this.TAG_GROUP)
    .subscribe((rs) => {
      this.tagsSubject$.next(rs.data);
    });
  }

  createOrUpdateModel(model?: Tag, errors?: string[]) {
    this.dialog.open(SetupTagEditComponent, {
      data: {
        model: model || {} as Tag,
        group: this.TAG_GROUP,
        errors
      },
      width: '500px',
      disableClose: true
    })
    .afterClosed().subscribe((newModel: Tag) => {
      if (!newModel) { return; }

      // creation or update existing
      this.isLoading = true;
      this.tagSvc.saveOrUpdate(newModel)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(rs => {
          const models = this.tagsSubject$.getValue();
          // Update or create
          if (model) {
            const index = _.findIndex(models, model);
            models[index] = rs.data;
          } else {
            models.push(rs.data);
          }

          this.snackBar.openFromComponent(SnackbarNotifComponent, {data: {message: rs.message, type: 'success'}});
        }, (err: GenericRs<any>) => {
          this.snackBar.openFromComponent(SnackbarNotifComponent, {data: {message: err.message, type: 'danger'}});
          this.createOrUpdateModel(newModel);
        });
    });
  }

  removeModel(model: Tag) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Apakah Anda ingin menghapus kategori <strong>${model.tag}</strong>?`,
        buttonText: {
          ok: 'Ya',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.isLoading = true;
        this.tagSvc.delete(model.id)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe(rs => {
            const models = this.tagsSubject$.getValue();
            _.remove(models, {id: model.id});
          });
      }
    });
  }
}
