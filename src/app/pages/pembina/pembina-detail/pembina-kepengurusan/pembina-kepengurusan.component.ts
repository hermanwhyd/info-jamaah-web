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
import { debounceTime, finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import _ from 'lodash';

import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from 'src/@vex/animations/scale-fade-in.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import jmespath from 'jmespath';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from 'src/app/shared/utilities/confirmation-dialog/confirmation-dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PembinaService } from '../../shared/pembina.service';
import { Kepengurusan } from '../../shared/kepengurusan.interface';
import { PengurusTable } from '../../shared/pembina.interface';
import { SharedProperty } from 'src/app/shared/types/shared-property.interface';
import { SharedPropertyService } from 'src/app/shared/services/shared-property.service';
import { AddPengurusDialogComponent } from '../../shared/components/add-pengurus-dialog/add-pengurus-dialog.component';

@UntilDestroy()
@Component({
  selector: 'vex-pembina-kepengurusan',
  templateUrl: './pembina-kepengurusan.component.html',
  styleUrls: ['./pembina-kepengurusan.component.scss'],
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
export class PembinaKepengurusanComponent implements OnInit, AfterViewInit {

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

  kepengurusanSubject = new BehaviorSubject<Kepengurusan[]>(null);
  kepengurusan$ = this.kepengurusanSubject.asObservable();

  dapuanSubject = new BehaviorSubject<SharedProperty[]>(null);
  dapuan$ = this.dapuanSubject.asObservable();

  searchCtrl = new FormControl();
  searchStr$ = this.searchCtrl.valueChanges.pipe(
    debounceTime(10)
  );

  lvPembina: string;
  pembinaEnum: string;

  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  dataSource: MatTableDataSource<PengurusTable>;
  menuOpen = false;

  expandedRow: Kepengurusan | null;

  columns: TableColumn<PengurusTable>[] = [
    { label: 'DAPUAN', property: 'dapuan.label', type: 'text', visible: true, cssClasses: ['font-medium', 'border-b-0', 'w-1/3'] },
    { label: 'DAPUAN', property: 'pengurus[*].jamaah', type: 'image', visible: true, cssClasses: ['text-right', 'text-secondary', 'border-b-0'] }
  ];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private pembinaSvc: PembinaService,
    private sharedPropSvc: SharedPropertyService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.initModel();
    this.registerDs();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  private initModel() {
    this.route.parent.paramMap
      .pipe(untilDestroyed(this))
      .subscribe(params => {
        this.lvPembina = params.get('level');
        this.pembinaEnum = params.get('pembina');
        this.fetchDapuan();
        this.fetchPengurus();
      });
  }

  private registerDs() {
    combineLatest([this.dapuan$, this.kepengurusan$])
      .subscribe(([dapuan, kepengurusan]) => {
        const table: PengurusTable[] = [];
        const grouped = _.groupBy(kepengurusan, (v: any) => {
          return v.dapuan?.code;
        });

        dapuan?.forEach((dp: any) => {
          table.push(
            {
              dapuan: dp,
              pengurus: grouped[`${dp.code}`]
            }
          );
        });

        this.dataSource.data = table;
      });
  }

  private fetchDapuan() {
    this.sharedPropSvc.findByGroup(`DAPUAN_${this.lvPembina}`)
      .subscribe(data => {
        this.dapuanSubject.next(data.data);
      });
  }

  fetchPengurus() {
    this.loadingSubject.next(true);
    this.pembinaSvc.getKepengurusan(this.pembinaEnum, 'jamaah,dapuan,pembina')
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe(data => {
        this.kepengurusanSubject.next(data.data);
      });
  }

  onAddKepengurusan(pengurusTable: PengurusTable) {
    this.dialog.open(AddPengurusDialogComponent, {
      data: {
        pengurusTable,
        pembinaEnum: this.pembinaEnum
      }
    });
  }

  onDeleteKepengurusan(model: Kepengurusan) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Apakah Anda ingin menghapus <strong>${model.jamaah.fullName}</strong> dari dapuan <strong>${model.dapuan.label}</strong>?`,
        buttonText: {
          ok: 'Ya',
          cancel: 'Batal'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.pembinaSvc.removePengurus(this.pembinaEnum, model.id)
          .subscribe(() => {
            const models = this.kepengurusanSubject.getValue();
            _.remove(models, { id: model.id });
            this.kepengurusanSubject.next(models);
          });
      }
    });
  }

}
