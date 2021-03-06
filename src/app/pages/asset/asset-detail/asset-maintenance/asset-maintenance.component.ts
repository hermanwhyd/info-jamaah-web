import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import icReload from '@iconify/icons-ic/twotone-refresh';
import icColumn from '@iconify/icons-ic/twotone-filter-list';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-plus';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';

import { FormControl } from '@angular/forms';
import { debounceTime, filter, finalize } from 'rxjs/operators';
import { Asset, AssetMaintenance } from '../../interfaces/asset.model';
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

import { SnackbarNotifComponent } from 'src/app/shared/utilities/snackbar-notif/snackbar-notif.component';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from 'src/@vex/animations/scale-fade-in.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import jmespath from 'jmespath';
import { AssetMaintenanceEditComponent } from './asset-maintenance-edit/asset-maintenance-edit.component';
import { GenericRs } from 'src/app/shared/types/generic-rs.model';

@UntilDestroy()
@Component({
  selector: 'vex-asset-maintenance',
  templateUrl: './asset-maintenance.component.html',
  styleUrls: ['./asset-maintenance.component.scss'],
  animations: [
    fadeInUp400ms,
    fadeInRight400ms,
    scaleIn400ms,
    stagger40ms,
    scaleFadeIn400ms
  ]
})
export class AssetMaintenanceComponent implements OnInit, AfterViewInit {

  icReload = icReload;
  icColumn = icColumn;
  icSearch = icSearch;
  icAdd = icAdd;
  icEdit = icEdit;
  icDelete = icDelete;
  icMoreVert = icMoreVert;

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
  dataSource: MatTableDataSource<AssetMaintenance> | null;
  menuOpen = false;

  columns: TableColumn<AssetMaintenance>[] = [
    { label: 'JUDUL', property: 'title', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'TIPE PERAWATAN', property: 'type.label', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'PENYEDIA JASA', property: 'supplier.title', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'TGL DIMULAI', property: 'startDate', type: 'date', visible: true, cssClasses: ['text-secondary'] },
    { label: 'TGL SELESAI', property: 'endDate', type: 'date', visible: true, cssClasses: ['text-secondary'] },
    { label: 'NOTES', property: 'notes', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'ACTION', property: 'menu', type: 'button', visible: true, cssClasses: ['text-secondary', 'w-10'] }
  ];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private assetSvc: AssetService,
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

  fetchModels() {
    this.loadingSubject.next(true);
    this.assetSvc.getById(this.assetId, 'maintenances.type,maintenances.supplier')
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
      this.dataSource.data = a.maintenances;
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

  createOrUpdateModel(model?: AssetMaintenance) {
    this.dialog.open(AssetMaintenanceEditComponent, {
      data: {
        model: model || { assetId: this.assetId } as AssetMaintenance
      },
      width: '100%',
      maxWidth: 600,
      disableClose: true
    })
      .afterClosed().subscribe((newModel: AssetMaintenance) => {
        if (!newModel) { return; }

        // creation or update existing
        this.assetSvc.saveOrUpdateMaintenance(newModel)
          .subscribe({
            next: rs => {
              const asset = this.assetSubject.getValue();
              // Update or create
              if (model) {
                const index = _.findIndex(asset.maintenances, model);
                asset.maintenances[index] = rs.data;
              } else {
                asset.maintenances.unshift(rs.data);
              }
              this.assetSubject.next(asset);
              this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: 'Data berhasil disimpan', type: 'success' } });
            },
            error: (err: GenericRs<AssetMaintenance>) => {
              this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: err.message, type: 'danger' } });
              this.createOrUpdateModel(newModel);
            }
          });
      });
  }

  onDeleteModel(model: AssetMaintenance) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Apakah Anda ingin menghapus <strong>${model.title}</strong>?`,
        buttonText: {
          ok: 'Ya',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.assetSvc.deleteMaintenance(model.id)
          .subscribe({
            next: () => {
              const asset = this.assetSubject.getValue();
              _.remove(asset.maintenances, { id: model.id });
              this.assetSubject.next(asset);
              this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: 'Berhasil menghapus data!', type: 'success' } });
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
}
