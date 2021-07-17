import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Asset } from '../interfaces/asset.model';

import icClose from '@iconify/icons-ic/twotone-close';
import icDelete from '@iconify/icons-ic/twotone-delete';
import { AssetService } from '../service/asset.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'vex-asset-copy',
  templateUrl: './asset-copy.component.html',
  styleUrls: ['./asset-copy.component.scss']
})
export class AssetCopyComponent implements OnInit {

  asset: Asset;
  isSubmitting = false;

  icClose = icClose;
  icDelete = icDelete;

  form = this.fb.group({
    detail: false,
    maintenance: false,
    audit: false,
    file: false,
    notification: false
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private model: Asset,
    private matDialog: MatDialog,
    private fb: FormBuilder,
    private assetSvc: AssetService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.asset = this.model;
  }

  submit() {
    const form = this.form.getRawValue();
    this.isSubmitting = true;
    this.assetSvc.copy(this.asset.id, form)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (rs) => {
          this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: 'Data berhasil diduplikasi', type: 'success' } });
          this.router.navigate(['benda-sabil', 'form', rs.data.id], { relativeTo: this.route });
          this.matDialog.closeAll();
        },
        error: (err) => this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: err.message, type: 'danger' } })
      });
  }
}
