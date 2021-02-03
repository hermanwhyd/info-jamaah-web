import { Component, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/helpers/format-datepicker';

import icArrowDown from '@iconify/icons-ic/round-keyboard-arrow-down';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icGroup from '@iconify/icons-ic/twotone-group';
import icTraining from '@iconify/icons-ic/baseline-model-training';
import icCount from '@iconify/icons-ic/baseline-room-service';
import icPieChart from '@iconify/icons-ic/baseline-room-service';

import { FormGroup, FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, filter, finalize } from 'rxjs/operators';
import { DateTime } from 'luxon';

import { StatisticService } from '../services/statistic.service';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexLegend,
  ChartComponent
} from 'ng-apexcharts';
import { scaleFadeIn400ms } from 'src/@vex/animations/scale-fade-in.animation';
import { BehaviorSubject } from 'rxjs';

export interface ApexDataLabels {
  enabled?: boolean;
  enabledOnSeries?: undefined | number[];
  textAnchor?: 'start' | 'middle' | 'end';
  distributed?: boolean;
  offsetX?: number;
  offsetY?: number;
  style?: {
      fontSize?: string;
      fontFamily?: string;
      fontWeight?: string | number;
      colors?: string[];
  };
  background?: {
      enabled?: boolean;
      foreColor?: string;
      borderRadius?: number;
      padding?: number;
      opacity?: number;
      borderWidth?: number;
      borderColor?: string;
      dropShadow?: ApexDropShadow;
  };
  dropShadow?: ApexDropShadow;
  formatter?(val: number, opts?: any): string | number | any[];
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
};

@UntilDestroy()
@Component({
  selector: 'vex-dashboard-bank-diklat',
  templateUrl: './dashboard-bank-diklat.component.html',
  styleUrls: ['./dashboard-bank-diklat.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ],
  animations: [
    scaleFadeIn400ms
  ]
})
export class DashboardBankDiklatComponent implements OnInit {

  icArrowDown = icArrowDown;
  icMoreVert = icMoreVert;
  icMoreHoriz = icMoreHoriz;
  icGroup = icGroup;
  icTraining = icTraining;
  icCount = icCount;
  icPieChart = icPieChart;

  dtRangeText = '';
  topSize = 10;

  dtRangeLuxon = { dtStart: null, dtEnd: null };

  loadingTMT = false;
  loadingCard = false;

  statisticFeed: any;

  chartPieOptions: any;

  dsTMTSubject: BehaviorSubject<any[]> = new BehaviorSubject([]);
  dsTMTSubject$ = this.dsTMTSubject.asObservable();

  dtRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  dtRange$ = this.dtRange.valueChanges.pipe(debounceTime(10));

  @ViewChild('chart') chart: ChartComponent;
  public tmcOptions: Partial<ChartOptions>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly statisticSvc: StatisticService
    ) {
  }

  ngOnInit(): void {
    this.initChartPie([], []);
    this.registerSubs();
    this.changeDateRage('thisyear');
    this.onDtRangeChanges();
    this.fetchDashboardFeed();
  }

  private initChartPie(series: any[], labels: any[]) {
    this.chartPieOptions = {
      series,
      labels,
      chart: {
        width: 380,
        type: 'donut'
      },
      plotOptions: {
        pie: {
          startAngle: -100,
          endAngle: 100,
          offsetY: 10,
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: false,
                show: true,
                label: 'Inisiator Diklat'
              }
            }
          }
        }
      },
      grid: {
        padding: {
          bottom: -80
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
  }

  private fetchDashboardFeed() {
    this.loadingCard = true;
    this.statisticSvc.getBankDiklatDataFeed()
    .pipe(finalize(() => this.loadingCard = false))
    .subscribe(g => {
      this.statisticFeed = g.data;
      const map = this.statisticFeed.bankDiklatInistator as any[];
      this.initChartPie(map.map(o => o.count), map.map(o => o.label));
    });
  }

  private registerSubs() {
    this.dsTMTSubject$
      .subscribe(d => {
        this.initChartTM(d);
      });
  }

  changeDateRage(period: string): void {
    let stDate: Date;
    let endDate: Date;

    if (period === 'thisyear') {
      stDate = DateTime.local().startOf('year').toJSDate();
      endDate = DateTime.local().toJSDate();
    } else if (period === 'lastyear') {
      stDate = DateTime.local().minus({year: 1}).startOf('year').toJSDate();
      endDate = DateTime.local().minus({year: 1}).endOf('year').toJSDate();
    } else if (period === 'last365days') {
      stDate = DateTime.local().minus({year: 1}).toJSDate();
      endDate = DateTime.local().toJSDate();
    } else if (period === 'last90days') {
      stDate = DateTime.local().minus({days: 90}).toJSDate();
      endDate = DateTime.local().toJSDate();
    } else if (period === 'last30days') {
      stDate = DateTime.local().minus({days: 30}).toJSDate();
      endDate = DateTime.local().toJSDate();
    } else if (period === 'alloftime') {
      stDate = DateTime.fromISO('2021-01-01T00:00:00').toJSDate();
      endDate = DateTime.local().toJSDate();
    }

    this.dtRange.patchValue({
      start: stDate,
      end: endDate,
    });
  }

  onDtRangeChanges(): void {
    this.dtRange$
      .pipe(untilDestroyed(this))
      .pipe(filter(o => !!o.end))
      .subscribe(val => {
        this.dtRangeLuxon.dtStart = DateTime.fromJSDate(this.dtRange.controls.start.value).startOf('month');
        this.dtRangeLuxon.dtEnd = DateTime.fromJSDate(this.dtRange.controls.end.value).endOf('month');
        this.dtRangeText = this.dtRangeLuxon.dtStart.toFormat('MMM yyyy') + ' - ' + this.dtRangeLuxon.dtEnd.toFormat('MMM yyyy');

        this.fetchDsTreeMapTop(10);
      });
  }

  fetchDsTreeMapTop(topSize: number): void {
    this.topSize = topSize;

    this.loadingTMT = true;
  }

  initChartTM(data: any[]): void {
    this.tmcOptions = {
      series: [{data}],
      legend: {
        show: false
      },
      chart: {
        height: 400,
        type: 'treemap',
        toolbar: {
          show: false
        },
        events: {
          dataPointSelection: (event, chartContext, config) => {
            const idx = config.dataPointIndex;
            const id = (this.dsTMTSubject.getValue()[idx]).id;
            this.router.navigate(['./', id], {relativeTo: this.activatedRoute});
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter(text, op) {
          return  [text, '' + op.value + ' peminat'];
        }
      },
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false
        }
      }
    };
  }

}
