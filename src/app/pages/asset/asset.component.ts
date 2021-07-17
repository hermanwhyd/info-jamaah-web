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

import { Asset } from './interfaces/asset.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { TableMenu } from './interfaces/table-menu.inteface';
import { ConfirmationDialogComponent } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component';

import { BehaviorSubject } from 'rxjs';
import { AssetService } from './service/asset.service';
import _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetCopyComponent } from './asset-copy/asset-copy.component';

@Component({
  selector: 'vex-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class AssetComponent implements OnInit {
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

  assetsSubject$: BehaviorSubject<Asset[]> = new BehaviorSubject([]);
  activeActegory$: BehaviorSubject<string> = new BehaviorSubject('all');
  assets: Asset[] = [];

  tableColumns: TableColumn<Asset>[] = [
    { label: 'IMAGE', property: 'avatar', type: 'image' },
    { label: 'NAMA ASET', property: 'title', type: 'text', cssClasses: ['text-secondary'] },
    { label: 'TAG ASET', property: 'tagNo', type: 'text', cssClasses: ['text-secondary'] },
    { label: 'KATEGORI', property: 'category.label', type: 'text', cssClasses: ['text-secondary'] },
    { label: 'LOKASI', property: 'location.label', type: 'text', cssClasses: ['text-secondary'] },
    { label: 'STATUS', property: 'status.label', type: 'text', cssClasses: ['text-secondary'] },
    { label: 'PEMILIK', property: 'pembina.label', type: 'text', cssClasses: ['text-secondary'] },
    { label: '', property: 'menu', type: 'button', cssClasses: ['text-secondary', 'w-10'] },
  ];

  tableMenu: TableMenu[] = [
    { id: 'all', icon: icViewHeadline, label: 'Semua Benda SB' }
  ];

  constructor(
    private assetService: AssetService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.fetchData();

    this.activeActegory$.subscribe(cat => {
      const assets = this.assetsSubject$.getValue();
      this.assets = assets?.filter(u => {
        // return (cat === 'all') ? assets : _.includes(u.roles, cat.toUpperCase());
        return assets;
      });
    });
  }

  fetchData() {
    this.isLoading = true;
    this.assetService.getAllList()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((rs) => {
        this.assetsSubject$.next(rs.data);
        this.refreshData();
      });
  }

  createOrUpdateModel(model?: Asset) {
    const commands = model ? ['form', model.id] : ['form'];
    this.router.navigate(commands, { relativeTo: this.activatedRoute });
  }

  deleteModel(model: Asset) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Apakah Anda ingin menghapus benda SB <strong>${model.title}</strong>?`,
        buttonText: {
          ok: 'Ya',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.assetService.delete(model.id)
          .subscribe({
            next: (rs) => {
              const assets = this.assetsSubject$.getValue();
              _.remove(assets, { id: model.id });
              this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: 'Data berhasil dihapus!', type: 'success' } });
              this.refreshData();
            },
            error: (err) => this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: err.message, type: 'danger' } })
          });
      }
    });
  }

  cloneModel(model: Asset) {
    this.dialog.open(AssetCopyComponent, {
      data: model
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
