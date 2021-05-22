import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdditionalFieldService } from 'src/app/services/additional-field.service';
import { AdditionalField } from 'src/app/types/additional-field.interface';
import { CustomField } from 'src/app/types/custom-field.model';
import { ConfirmationDialogComponent } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';

import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/delete';
import { SharedPropertyService } from 'src/app/services/shared-property.service';

@Component({
  selector: 'vex-custom-field-editor',
  templateUrl: './custom-field-editor.component.html',
  styleUrls: ['./custom-field-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomFieldEditorComponent implements OnInit {

  icEdit = icEdit;
  icDelete = icDelete;

  @Input() model: CustomField;
  @Output() save = new EventEmitter<AdditionalField>();

  dropdownOptions = [] as any[];
  formCtrl: FormControl;

  constructor(
    private enumSvc: SharedPropertyService,
    private addFieldSvc: AdditionalFieldService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.formCtrl = new FormControl(this.model.value?.value || '');
  }

  updateField(): void {
    const detail = { ... this.model.value, customFieldId: this.model.id, value: this.formCtrl.value } as AdditionalField;
    if (!detail.id) {
      this.save.emit(detail);
      return;
    } else {
      this.onUpdate(detail);
    }
  }

  cancelField(): void {
    if (this.model.value) {
      this.formCtrl.setValue(this.model.value.value);
    }
  }

  get canDelete() {
    return this.model.value != null;
  }

  onUpdate(model: AdditionalField) {
    this.addFieldSvc.update(model)
      .subscribe({
        next: () => {
          this.model.value = model;
          this.formCtrl.markAsPristine();
        },
        error: err => {
          this.snackBar.openFromComponent(SnackbarNotifComponent, {
            data: {
              message: err.message || 'Gagal menyimpan data!', type: 'danger'
            }
          });
        }
      });
  }

  onDelete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Apakah Anda ingin menghapus value dari <strong>${this.model?.fieldName}</strong>?`,
        buttonText: {
          ok: 'Ya',
          cancel: 'Batal'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.addFieldSvc.delete(this.model.value.id)
          .subscribe({
            next: () => {
              this.model.value = null;
              this.formCtrl.setValue('');
            },
            error: err => {
              this.snackBar.openFromComponent(SnackbarNotifComponent, {
                data: {
                  message: err.message || 'Gagal menghapus data!', type: 'danger'
                }
              });
            }
          });
      }
    });
  }

  onModeChange(mode: 'view' | 'edit') {
    if (mode === 'edit' && this.dropdownOptions.length === 0) {
      if (this.model.fieldType === 'dropdown') {
        this.dropdownOptions = this.model.fieldReference.split(',');
      }

      if (this.model.fieldType === 'shared-property') {
        this.enumSvc.findByGroup(this.model.fieldReference).subscribe((rs) => this.dropdownOptions = rs.data);
      }
    }
  }
}
