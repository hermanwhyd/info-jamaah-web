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

import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarNotifComponent } from 'src/app/shared/utilities/snackbar-notif/snackbar-notif.component';
import { TableMenu } from '../../shared/types/table-menu.inteface';
import { ConfirmationDialogComponent } from 'src/app/shared/utilities/confirmation-dialog/confirmation-dialog.component';

import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Family } from './shared/interfaces/family.intereface';
import { FamilyService } from './shared/services/family.service';
import { FamilyAddComponent } from './family-add/family-add.component';

@Component({
  selector: 'vex-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.scss'],
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class FamilyComponent implements OnInit {
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

  familiesSubject$: BehaviorSubject<Family[]> = new BehaviorSubject([]);
  activeActegory$: BehaviorSubject<string> = new BehaviorSubject('all');
  families: Family[] = [];

  tableColumns: TableColumn<Family>[] = [
    { label: 'KELUARGA', property: 'label', type: 'text', cssClasses: ['font-medium'] },
    { label: 'FOTO KK', property: 'kepalaKeluarga.avatar', type: 'image', cssClasses: ['font-medium'] },
    { label: 'KEPALA KELUARGA', property: 'kepalaKeluarga.fullName', type: 'text', cssClasses: ['text-secondary'] },
    { label: 'PEMBINA', property: 'pembinaEnum', type: 'text', cssClasses: ['text-secondary'] },
    { label: 'ANGGOTA', property: 'membersCount', type: 'number', cssClasses: ['font-medium'] },
    { label: '', property: 'menu', type: 'button', cssClasses: ['text-secondary', 'w-10'] },
  ];

  tableMenu: TableMenu[] = [
    { id: 'all', icon: icViewHeadline, label: 'Semua Keluarga' }
  ];

  constructor(
    private familyService: FamilyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.fetchData();

    this.activeActegory$.subscribe(cat => {
      const families = this.familiesSubject$.getValue();
      this.families = families?.filter(u => {
        // return (cat === 'all') ? families : _.includes(u.roles, cat.toUpperCase());
        return families;
      });
    });
  }

  fetchData() {
    this.isLoading = true;
    this.familyService.getList()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((rs) => {
        this.familiesSubject$.next(rs.data);
        this.refreshData();
      });
  }

  createFamily() {
    const dialog = this.dialog.open(FamilyAddComponent, {
      width: '500px',
      disableClose: true
    });

    dialog.afterClosed().subscribe((newFamily: Family) => {
      if (!newFamily) { return; }

      console.log('new family', newFamily);
    });
  }

  deleteFamily(model: Family) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Apakah Anda ingin menghapus family <strong>${model.label}</strong>?`,
        buttonText: {
          ok: 'Ya',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.familyService.delete(model.id)
          .subscribe((rs) => {
            if (rs.status === 'ok') {
              const families = this.familiesSubject$.getValue();
              _.remove(families, { id: model.id });
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
