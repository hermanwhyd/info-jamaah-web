import { Component, OnInit } from '@angular/core';

import icContacts from '@iconify/icons-ic/twotone-contacts';
import icSearch from '@iconify/icons-ic/twotone-search';
import { scaleIn400ms } from '../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../@vex/animations/fade-in-right.animation';
import { TableColumn } from '../../../@vex/interfaces/table-column.interface';
import { FormControl } from '@angular/forms';
import { debounceTime, finalize } from 'rxjs/operators';
import { stagger40ms } from '../../../@vex/animations/stagger.animation';
import { MatDialog } from '@angular/material/dialog';

import icMenu from '@iconify/icons-ic/twotone-menu';
import icViewHeadline from '@iconify/icons-ic/twotone-view-headline';

import { Jamaah } from './interfaces/jamaah.model';
import { JamaahService } from './service/jamaah.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { TableMenu } from './interfaces/table-menu.inteface';
import { ConfirmationDialogComponent } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component';

import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { GenericRs } from 'src/app/types/generic-rs.model';
import { JamaahEditComponent } from './jamaah-edit/jamaah-edit.component';

@Component({
  selector: 'vex-jamaah',
  templateUrl: './jamaah.component.html',
  styleUrls: ['./jamaah.component.scss'],
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class JamaahComponent implements OnInit {
  icSearch = icSearch;
  icContacts = icContacts;
  icMenu = icMenu;

  isLoading = false;

  searchCtrl = new FormControl();
  searchStr$ = this.searchCtrl.valueChanges.pipe(
    debounceTime(10)
  );

  activeCategory: TableMenu['id'] = 'all';
  menuOpen = false;

  jamaahsSubject$: BehaviorSubject<Jamaah[]> = new BehaviorSubject([]);
  activeActegory$: BehaviorSubject<string> = new BehaviorSubject('all');
  jamaahs: Jamaah[] = [];

  tableColumns: TableColumn<Jamaah>[] = [
    { label: 'IMAGE', property: 'pegawai.photo', type: 'image' },
    { label: 'NAMA', property: 'fullName', type: 'text', cssClasses: ['text-secondary'] },
    { label: 'NAMA PANGGILAN', property: 'nickname', type: 'text', cssClasses: ['text-secondary'] },
    { label: 'JK', property: 'gender', type: 'text', cssClasses: ['text-secondary'] },
    { label: 'KLP', property: 'pembinaEnum', type: 'text', cssClasses: ['text-secondary'] },
    { label: '', property: 'menu', type: 'button', cssClasses: ['text-secondary', 'w-10'] },
  ];

  tableMenu: TableMenu[] = [
    { id: 'all', icon: icViewHeadline, label: 'Semua Jamaah' }
  ];

  constructor(private jamaahService: JamaahService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchData();

    this.activeActegory$.subscribe(cat => {
      const jamaahs = this.jamaahsSubject$.getValue();
      this.jamaahs = jamaahs?.filter(u => {
        // return (cat === 'all') ? jamaahs : _.includes(u.roles, cat.toUpperCase());
        return jamaahs;
      });
    });
  }

  fetchData() {
    this.isLoading = true;
    this.jamaahService.getJamaahList()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((rs) => {
        this.jamaahsSubject$.next(rs.data);
        this.refreshData();
      });
  }

  createOrUpdateJamaah(jamaah?: Jamaah) {
    this.dialog.open(JamaahEditComponent, {
      data: jamaah || {} as Jamaah,
      width: '500px',
      disableClose: true
    })
      .afterClosed().subscribe((newJamaah: Jamaah) => {
        if (!newJamaah) { return; }

        // creation or update existing
        this.jamaahService.saveOrUpdate(newJamaah)
          .subscribe(rs => {
            const jamaahs = this.jamaahsSubject$.getValue();
            // Update or create
            if (jamaah) {
              const index = _.findIndex(jamaahs, jamaah);
              jamaahs[index] = rs.data;
            } else {
              jamaahs.unshift(rs.data);
            }

            this.refreshData();
            this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: 'Jamaah berhasil disimpan', type: 'success' } });
          }, (err: GenericRs<any>) => {
            this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: err.message, type: 'danger' } });
            this.createOrUpdateJamaah(newJamaah);
          });
      });
  }

  deleteJamaah(model: Jamaah) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Apakah Anda ingin menghapus jamaah <strong>${model.fullName}</strong>?`,
        buttonText: {
          ok: 'Ya',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.jamaahService.delete(model.id)
          .subscribe((rs) => {
            if (rs.status === 'ok') {
              const jamaahs = this.jamaahsSubject$.getValue();
              _.remove(jamaahs, { id: model.id });
              this.refreshData();
            } else {
              this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: rs.message, type: 'danger' } });
            }
          });
      }
    });
  }

  applyFilter(category: string) {
    this.activeActegory$.next(category);
  }

  refreshData(): void {
    this.activeActegory$.next(this.activeActegory$.getValue());
  }

  openMenu() {
    this.menuOpen = true;
  }
}
