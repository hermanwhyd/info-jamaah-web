import { Component, OnInit, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';
import { Variable } from 'src/app/types/variable.model';
import { DashboardService } from '../services/dashboard.service';

import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import icView from '@iconify/icons-ic/remove-red-eye';
import icSearch from '@iconify/icons-ic/twotone-search';

import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { scaleFadeIn400ms } from 'src/@vex/animations/scale-fade-in.animation';

import { PopoverService } from 'src/@vex/components/popover/popover.service';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'vex-dashboard-evaluation',
  templateUrl: './dashboard-evaluation.component.html',
  styleUrls: ['./dashboard-evaluation.component.scss'],
  animations: [
    fadeInUp400ms,
    fadeInRight400ms,
    scaleFadeIn400ms,
    scaleIn400ms,
    stagger40ms
  ]
})
export class DashboardEvaluationComponent implements OnInit {

  icView = icView;
  icArrowDropDown = icArrowDropDown;
  icSearch = icSearch;

  searchCtrl = new FormControl();
  searchStr$ = this.searchCtrl.valueChanges.pipe(untilDestroyed(this)).pipe(debounceTime(100));

  isLoading = true;
  dashboardSubject: BehaviorSubject<Variable[]> = new BehaviorSubject<Variable[]>([]);
  models = [] as Variable[];

  years = [];
  year = (new Date()).getFullYear();

  constructor(private dashboardSvc: DashboardService, private popover: PopoverService) { }

  ngOnInit(): void {
    this.registerSubs();
    this.fetchModels();
    this.initYears();
  }

  private initYears() {
    for (let i = 2020; i <= this.year; i++) {
      this.years.push(i);
    }
  }

  private registerSubs() {
    // subject
    this.dashboardSubject.asObservable().subscribe(d => this.models = d);

    // search
    this.searchStr$.subscribe(val => {
      this.models = this.dashboardSubject.value.filter(i => i?.value.toLowerCase().includes(val?.toLowerCase()));
    });
  }

  yearChange(yrSelection: any) {
    this.year = yrSelection.value;
    this.fetchModels();
  }

  fetchModels() {
    this.isLoading = true;
    this.dashboardSvc.evaluationDataFeeds(this.year)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(rs => {
        this.dashboardSubject.next(rs.data);
      });
  }

  openAddDashboard(content: TemplateRef<any>, origin: HTMLElement) {
    this.popover.open({
      content,
      origin,
      position: [
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'bottom'
        },
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
        },
      ]
    })
  }
}
