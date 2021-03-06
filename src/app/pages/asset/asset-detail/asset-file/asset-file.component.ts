import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import icReload from '@iconify/icons-ic/twotone-refresh';
import icColumn from '@iconify/icons-ic/twotone-filter-list';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-plus';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';

import { FormControl } from '@angular/forms';
import { debounceTime, filter, finalize } from 'rxjs/operators';
import { Asset, AssetMedia } from '../../interfaces/asset.model';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AssetService } from '../../service/asset.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/utilities/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

import _ from 'lodash';
import fileSaver from 'file-saver';

import { SnackbarNotifComponent } from 'src/app/shared/utilities/snackbar-notif/snackbar-notif.component';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from 'src/@vex/animations/scale-fade-in.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import jmespath from 'jmespath';
import { MediaService } from 'src/app/shared/services/media.service';
import { AssetFileEditComponent } from './asset-file-edit/asset-file-edit.component';
import { GenericRs } from 'src/app/shared/types/generic-rs.model';

@UntilDestroy()
@Component({
  selector: 'vex-asset-file',
  templateUrl: './asset-file.component.html',
  styleUrls: ['./asset-file.component.scss'],
  animations: [
    fadeInUp400ms,
    fadeInRight400ms,
    scaleIn400ms,
    stagger40ms,
    scaleFadeIn400ms
  ]
})
export class AssetFileComponent implements OnInit, AfterViewInit {

  icReload = icReload;
  icColumn = icColumn;
  icSearch = icSearch;
  icAdd = icAdd;
  icDelete = icDelete;
  icMoreVert = icMoreVert;
  icDownload = icDownload;

  jmespath = jmespath;

  loadingSubject = new BehaviorSubject<boolean>(false);
  assetSubject = new BehaviorSubject<Asset>(null);

  asset$ = this.assetSubject.asObservable();

  searchCtrl = new FormControl();
  searchStr$ = this.searchCtrl.valueChanges.pipe(
    debounceTime(10)
  );

  assetId: number;

  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  dataSource: MatTableDataSource<AssetMedia> | null;
  menuOpen = false;

  columns: TableColumn<AssetMedia>[] = [
    { label: 'NAMA FILE', property: 'name', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'JENIS MIME', property: 'mimeType', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'GAMBAR', property: 'file.thumb', type: 'image', visible: true, cssClasses: ['text-secondary'] },
    { label: 'CATATAN', property: 'properties.notes', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Ukuran (KB)', property: 'size', type: 'number', visible: true, cssClasses: ['text-secondary'] },
    { label: 'TGL UPLOAD', property: 'createdAt', type: 'date', visible: false, cssClasses: ['text-secondary'] },
    { label: 'TGL UPDATE', property: 'updatedAt', type: 'date', visible: true, cssClasses: ['text-secondary'] },
    { label: 'ACTION', property: 'menu', type: 'button', visible: true, cssClasses: ['text-secondary', 'w-10'] }
  ];

  @Output() fireUploadFileDialog: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private assetSvc: AssetService,
    private mediaSvc: MediaService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.initModel();
    this.registerDs();
    this.registerSearch();
    this.fetchModels();
  }

  private initModel() {
    this.route.parent.parent.paramMap
      .pipe(untilDestroyed(this))
      .subscribe(params => {
        this.assetId = +params.get('id');
      });
  }

  reloadTable() {
    this.fetchModels();
  }

  fetchModels() {
    this.loadingSubject.next(true);
    this.assetSvc.getById(this.assetId, 'media')
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe(rs => {
        this.assetSubject.next(rs.data);
      });
  }

  private registerSearch() {
    this.searchCtrl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(value => this.onFilterChange(value));
  }

  private registerDs() {
    this.asset$.pipe(
      filter<Asset>(Boolean)
    ).subscribe(a => {
      this.dataSource.data = a.media;
    });
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  toggleColumnVisibility(column: any, event: any) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  openMenu() {
    this.menuOpen = true;
  }

  openUploadDialog() {
    this.fireUploadFileDialog.emit(this.assetId);
  }

  createOrUpdateModel(model?: AssetMedia) {
    this.dialog.open(AssetFileEditComponent, {
      data: {
        model: model || {} as AssetMedia,
        collectionTypes: [{ code: 'DOCS', label: 'Dokumen Pendukung' }, { code: 'PHOTO', label: 'Foto Aset' }]
      },
      width: '100%',
      maxWidth: 600,
      disableClose: true
    })
      .afterClosed().subscribe((o: any) => {
        if (!o.model) { return; }
        if (o.action === 'download') { this.onDownloadModel(o.model); }
        if (o.action === 'save') { this.onSaveOrUpdate(model, o.model); }
      });
  }

  private onSaveOrUpdate(model: AssetMedia, newModel?: AssetMedia) {
    // creation or update existing
    this.mediaSvc.saveOrUpdate(newModel)
      .subscribe({
        next: rs => {
          const asset = this.assetSubject.getValue();
          // Update or create
          if (model) {
            const index = _.findIndex(asset.media, model);
            asset.media[index] = rs.data;
          } else {
            asset.media.unshift(rs.data);
          }
          this.assetSubject.next(asset);
          this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: 'Data berhasil disimpan', type: 'success' } });
        },
        error: (err: GenericRs<AssetMedia>) => {
          this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: err.message, type: 'danger' } });
          this.createOrUpdateModel(newModel);
        }
      });
  }

  onDeleteModel(model: AssetMedia) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Apakah Anda ingin menghapus file <strong>${model.name}</strong>?`,
        buttonText: {
          ok: 'Ya',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.mediaSvc.delete(model.uuid)
          .subscribe(() => {
            const asset = this.assetSubject.getValue();
            _.remove(asset.media, { id: model.id });
            this.assetSubject.next(asset);
          }, err => {
            this.snackBar.openFromComponent(
              SnackbarNotifComponent,
              {
                data: {
                  message: err.message || 'Gagal menghapus data!',
                  type: 'danger'
                }
              });
          });
      }
    });
  }

  onDownloadModel(model: AssetMedia) {
    this.mediaSvc.downloadSigle(model.uuid)
      .subscribe(rs => {
        const blob: any = new Blob([rs], { type: model.mimeType });
        fileSaver.saveAs(blob, model.name);
      });
  }
}
