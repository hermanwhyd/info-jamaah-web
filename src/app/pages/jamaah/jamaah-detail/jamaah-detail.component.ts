import { Component, OnInit } from '@angular/core';
import { Link } from 'src/@vex/interfaces/link.interface';

import { scaleIn400ms } from '../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../@vex/animations/fade-in-right.animation';

import icArrowBack from '@iconify/icons-ic/arrow-back';
import icEdit from '@iconify/icons-ic/baseline-edit';
import icDelete from '@iconify/icons-ic/baseline-delete';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';

import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { JamaahService } from '../shared/services/jamaah.service';
import { Jamaah } from '../shared/interfaces/jamaah.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/utilities/confirmation-dialog/confirmation-dialog.component';
import { SnackbarNotifComponent } from 'src/app/shared/utilities/snackbar-notif/snackbar-notif.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'vex-jamaah-detail',
  templateUrl: './jamaah-detail.component.html',
  styleUrls: ['./jamaah-detail.component.scss'],
  animations: [
    fadeInRight400ms,
    scaleIn400ms,
  ]
})
export class JamaahDetailComponent implements OnInit {

  icArrowBack = icArrowBack;
  icDelete = icDelete;
  icEdit = icEdit;
  icMoreVert = icMoreVert;

  model: Jamaah;
  isLoading = true;

  links: Link[] = [
    {
      label: 'Profil',
      route: './',
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Pembinaan',
      route: './pembinaan',
      disabled: true,
    },
    {
      label: 'Dapuan',
      route: './dapuan',
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private jamaahSvc: JamaahService,
    private router: Router,
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
        this.isLoading = true;
        this.jamaahSvc.getById(id)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe(g => {
            this.model = g.data;
          });
      });
  }

  public onDeleteModel() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Apakah Anda ingin menghapus jamaah <strong>${this.model.fullName}</strong>?`,
        buttonText: {
          ok: 'Ya',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.jamaahSvc.delete(this.model.id)
            .subscribe({
              next: () => this.router.navigateByUrl('/jamaah'),
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
