import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import icReload from '@iconify/icons-ic/twotone-refresh';
import icColumn from '@iconify/icons-ic/twotone-filter-list';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-plus';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icClose from '@iconify/icons-ic/twotone-close';

import { FormControl } from '@angular/forms';
import { debounceTime, filter, finalize } from 'rxjs/operators';
import { Asset } from '../../interfaces/asset.model';
import { AssetService } from '../../service/asset.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import _ from 'lodash';

import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from 'src/@vex/animations/scale-fade-in.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import jmespath from 'jmespath';
import { Notifier } from 'src/app/shared/types/notifier.interface';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogComponent } from 'src/app/shared/utilities/confirmation-dialog/confirmation-dialog.component';
import { SnackbarNotifComponent } from 'src/app/shared/utilities/snackbar-notif/snackbar-notif.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AssetNotificationEditComponent } from './asset-notification-edit/asset-notification-edit.component';

@UntilDestroy()
@Component({
  selector: 'vex-asset-notification',
  templateUrl: './asset-notification.component.html',
  styleUrls: ['./asset-notification.component.scss'],
  animations: [
    fadeInUp400ms,
    fadeInRight400ms,
    scaleIn400ms,
    stagger40ms,
    scaleFadeIn400ms,
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AssetNotificationComponent implements OnInit, AfterViewInit {

  icReload = icReload;
  icColumn = icColumn;
  icSearch = icSearch;
  icAdd = icAdd;
  icEdit = icEdit;
  icDelete = icDelete;
  icMoreVert = icMoreVert;
  icClose = icClose;

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
  dataSource: MatTableDataSource<Notifier>;
  menuOpen = false;

  expandedRow: Notifier | null;

  columns: TableColumn<Notifier>[] = [
    { label: 'NAMA', property: 'name', type: 'text', visible: true, cssClasses: ['font-medium', 'border-b-0'] },
    { label: 'DESKRIPSI', property: 'description', type: 'text', visible: false, cssClasses: ['text-secondary', 'border-b-0'] },
    { label: 'REFERENSI', property: 'referable.customField.fieldName', type: 'text', visible: true, cssClasses: ['text-secondary', 'border-b-0'] },
    { label: 'TGL JTH TEMPO', property: 'dueDateAt', type: 'date', visible: true, cssClasses: ['text-secondary', 'border-b-0'] },
    { label: 'HARI PENGINGAT', property: 'reminderDays', type: 'text', visible: true, cssClasses: ['text-secondary', 'border-b-0'] },
    {
      label: 'PENERIMA', property: 'subscriptions[*].subscriber.label[] | join(\',\', @)'
      , type: 'text', visible: true, cssClasses: ['text-secondary', 'border-b-0']
    },
    { label: 'ACTION', property: 'menu', type: 'button', visible: true, cssClasses: ['text-secondary', 'w-10', 'border-b-0'] }
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
    this.assetSvc.getById(this.assetId, 'notifiers.subscriptions.subscriber.enumables,notifiers.referable.customField')
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
      this.dataSource.data = a.notifiers;
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

  createOrUpdateModel(model = { reminderDays: [] } as Notifier) {
    this.dialog.open(AssetNotificationEditComponent, {
      data: {
        model,
        assetId: this.assetId
      },
      width: '100%',
      maxWidth: 600,
      disableClose: true
    })
      .afterClosed().subscribe((newModel: Notifier) => {
        if (_.isEqual(newModel, model)) { return; }

        const asset = this.assetSubject.getValue();
        if (model?.id) {
          const index = _.findIndex(asset.notifiers, model);
          asset.notifiers[index] = newModel;
        } else {
          asset.notifiers.unshift(newModel);
        }
        this.assetSubject.next(asset);
      });
  }

  onDeleteModel(model: Notifier) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Apakah Anda ingin menghapus <strong>${model.name}</strong>?`,
        buttonText: {
          ok: 'Ya',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.assetSvc.deleteNotifier(model.id)
          .subscribe({
            next: () => {
              const asset = this.assetSubject.getValue();
              _.remove(asset.notifiers, { id: model.id });
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
