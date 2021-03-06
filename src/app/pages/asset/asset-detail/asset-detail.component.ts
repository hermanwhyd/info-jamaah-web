import { Component, OnInit } from '@angular/core';
import { Link } from 'src/@vex/interfaces/link.interface';
import { scaleIn400ms } from '../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../@vex/animations/fade-in-right.animation';

import icAttachFile from '@iconify/icons-ic/twotone-attach-file';
import icArrowBack from '@iconify/icons-ic/arrow-back';
import icEdit from '@iconify/icons-ic/baseline-edit';
import icDelete from '@iconify/icons-ic/baseline-delete';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icCopy from '@iconify/icons-ic/twotone-file-copy';

import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AssetService } from '../service/asset.service';
import { Asset } from '../interfaces/asset.model';
import { MatDialog } from '@angular/material/dialog';
import { AssetUploadComponent } from '../asset-upload/asset-upload.component';
import { ConfirmationDialogComponent } from 'src/app/shared/utilities/confirmation-dialog/confirmation-dialog.component';
import { SnackbarNotifComponent } from 'src/app/shared/utilities/snackbar-notif/snackbar-notif.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssetCopyComponent } from '../asset-copy/asset-copy.component';

@UntilDestroy()
@Component({
  selector: 'vex-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.scss'],
  animations: [
    fadeInRight400ms,
    scaleIn400ms,
  ]
})
export class AssetDetailComponent implements OnInit {

  model: Asset;
  icArrowBack = icArrowBack;
  icAttachFile = icAttachFile;
  icDelete = icDelete;
  icEdit = icEdit;
  icCopy = icCopy;
  icMoreVert = icMoreVert;

  componentReference: any;

  links: Link[] = [
    {
      label: 'Detail',
      route: './',
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Perawatan',
      route: './maintenances',
    },
    {
      label: 'Audit',
      route: './audits',
    },
    {
      label: 'Berkas',
      route: './files',
    },
    {
      label: 'Pengingat',
      route: './notifier',
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private assetSvc: AssetService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initModel();
  }

  private initModel() {
    this.route.paramMap
      .pipe(untilDestroyed(this))
      .subscribe(params => {
        const id = params.get('id');
        this.assetSvc.getById(id).subscribe(g => {
          this.model = g.data;
        });
      });
  }

  uploadFile() {
    this.dialog.open(AssetUploadComponent, {
      data: { model: this.model, cf: this.componentReference },
      width: '500px',
    });
  }

  onActivate(componentReference: any) {
    this.componentReference = componentReference;

    // Below will subscribe to the searchItem emitter
    componentReference.fireUploadFileDialog?.subscribe(() => {
      this.uploadFile();
    });
  }

  copyModel() {
    this.dialog.open(AssetCopyComponent, {
      data: this.model
    });
  }

  onDeleteModel() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Apakah Anda ingin menghapus aset <strong>${this.model.title}</strong>?`,
        buttonText: {
          ok: 'Ya',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.assetSvc.delete(this.model.id)
          .subscribe({
            next: () => this.router.navigateByUrl('/benda-sabil'),
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
}
