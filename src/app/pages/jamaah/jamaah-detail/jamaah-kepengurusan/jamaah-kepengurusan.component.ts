import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import icReload from '@iconify/icons-ic/twotone-refresh';
import icColumn from '@iconify/icons-ic/twotone-filter-list';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-plus';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icClose from '@iconify/icons-ic/twotone-close';
import icTime from '@iconify/icons-ic/baseline-access-time';

import { FormControl } from '@angular/forms';
import { debounceTime, finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import _ from 'lodash';
import jmespath from 'jmespath';

import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from 'src/@vex/animations/scale-fade-in.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';

import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from 'src/app/shared/utilities/confirmation-dialog/confirmation-dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SharedProperty } from 'src/app/shared/types/shared-property.interface';
import { JamaahService } from '../../shared/services/jamaah.service';
import { Jamaah, JamaahPengurus } from '../../shared/interfaces/jamaah.model';
import { Kepengurusan } from 'src/app/pages/pembina/shared/kepengurusan.interface';
import { Pembina } from 'src/app/shared/types/pembina.interface';
import { PembinaService } from 'src/app/pages/pembina/shared/pembina.service';
import { AddPengurusDialogComponent } from './add-pengurus-dialog/add-pengurus-dialog.component';

@UntilDestroy()
@Component({
  selector: 'vex-jamaah-kepengurusan',
  templateUrl: './jamaah-kepengurusan.component.html',
  styleUrls: ['./jamaah-kepengurusan.component.scss'],
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
export class JamaahKepengurusanComponent implements OnInit, AfterViewInit {

  icReload = icReload;
  icColumn = icColumn;
  icSearch = icSearch;
  icAdd = icAdd;
  icEdit = icEdit;
  icDelete = icDelete;
  icMoreVert = icMoreVert;
  icClose = icClose;
  icTime = icTime;

  jmespath = jmespath;

  isLoading = false;

  kepengurusanSubject = new BehaviorSubject<Kepengurusan[]>(null);
  kepengurusan$ = this.kepengurusanSubject.asObservable();

  pembinaSubject = new BehaviorSubject<Pembina>(null);
  pembina$ = this.pembinaSubject.asObservable();

  dapukanSubject = new BehaviorSubject<SharedProperty[]>(null);
  dapukan$ = this.dapukanSubject.asObservable();

  jamaahKpngrsSubject = new BehaviorSubject<JamaahPengurus[]>(null);

  jamaahId: number;
  model: Jamaah;

  searchCtrl = new FormControl();
  searchStr$ = this.searchCtrl.valueChanges.pipe(
    debounceTime(10)
  );

  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  dataSource: MatTableDataSource<JamaahPengurus>;

  expandedRow: Kepengurusan | null;

  columns: TableColumn<JamaahPengurus>[] = [
    { label: 'PEMBINA', property: 'pembina.label', type: 'text', visible: true, cssClasses: ['font-medium', 'border-b-0'] },
    { label: 'PENGURUS', property: 'pengurus[*].dapukan', type: 'label', visible: true, cssClasses: ['text-right', 'text-secondary', 'border-b-0'] }
  ];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private jamaahSvc: JamaahService,
    private pembinaSvc: PembinaService,
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
    this.route.parent.parent.paramMap
      .pipe(untilDestroyed(this))
      .subscribe(params => {
        this.jamaahId = +params.get('id');
        this.getJamaahPengurus();
      });
  }

  getJamaahPengurus() {
    this.isLoading = true;

    forkJoin([
      this.jamaahSvc.getById(this.jamaahId, 'kepengurusans.pembina,kepengurusans.dapukan'),
      this.jamaahSvc.getPembina(this.jamaahId)
    ])
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(rs => {
        this.model = rs[0].data;
        this.kepengurusanSubject.next(this.model.kepengurusans);
        this.pembinaSubject.next(rs[1].data);
      });
  }

  private registerDs() {
    combineLatest([this.pembina$, this.kepengurusan$])
      .subscribe(([pembina, kepengurusan]) => {
        const table: JamaahPengurus[] = [];
        const grouped = _.groupBy(kepengurusan, (v: any) => {
          return v.pembina?.code;
        });

        if (pembina) {
          table.push({ lvPembinaEnum: 'DA', pembina: pembina.DA, pengurus: grouped[`${pembina.DA.code}`] });
          table.push({ lvPembinaEnum: 'DS', pembina: pembina.DS, pengurus: grouped[`${pembina.DS.code}`] });
          table.push({ lvPembinaEnum: 'KLP', pembina: pembina.KLP, pengurus: grouped[`${pembina.KLP.code}`] });
        }

        this.dataSource.data = table;
      });
  }

  onAddKepengurusan(jamaahPengurus: JamaahPengurus) {
    this.dialog.open(AddPengurusDialogComponent, {
      width: '400px',
      data: {
        jamaahPengurus,
        jamaahId: this.jamaahId,
        kepengurusanSubject: this.kepengurusanSubject
      }
    });
  }

  onDeleteKepengurusan(model: Kepengurusan) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Apakah Anda ingin menghapus dapukan <strong>${model.dapukan.label}</strong>?`,
        buttonText: {
          ok: 'Ya',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.pembinaSvc.removePengurus(model.pembina.code, model.id)
          .subscribe(() => {
            const models = this.kepengurusanSubject.getValue();
            _.remove(models, { id: model.id });
            this.kepengurusanSubject.next(models);
          });
      }
    });
  }

}
