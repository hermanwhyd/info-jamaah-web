import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';

import faGender from '@iconify/icons-fa-solid/venus-mars';
import faReligion from '@iconify/icons-fa-solid/praying-hands';
import icNumber from '@iconify/icons-ic/baseline-assignment-ind';
import icArrowBack from '@iconify/icons-ic/arrow-back';
import icMail from '@iconify/icons-ic/twotone-mail';
import icAccessTime from '@iconify/icons-ic/twotone-access-time';
import icWork from '@iconify/icons-ic/twotone-work';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icCheck from '@iconify/icons-ic/twotone-check';
import icView from '@iconify/icons-ic/remove-red-eye';
import icQuestion from '@iconify/icons-ic/help-outline';
import icHome from '@iconify/icons-ic/baseline-home';
import icMap from '@iconify/icons-ic/baseline-map';

import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Asset } from '../../interfaces/asset.model';
import { AssetService } from '../../service/asset.service';
import { finalize } from 'rxjs/operators';
import { scaleFadeIn400ms } from 'src/@vex/animations/scale-fade-in.animation';
import _ from 'lodash';
import { Gallery, GalleryItem } from 'ng-gallery';
import { forkJoin } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'vex-asset-overview',
  templateUrl: './asset-overview.component.html',
  styleUrls: ['./asset-overview.component.scss'],
  animations: [
    fadeInUp400ms,
    fadeInRight400ms,
    scaleIn400ms,
    stagger40ms,
    scaleFadeIn400ms
  ],
})
export class AssetOverviewComponent implements OnInit {

  icNumber = icNumber;
  faGender = faGender;
  faReligion = faReligion;
  icQuestion = icQuestion;
  icView = icView;
  icArrowBack = icArrowBack;
  icWork = icWork;
  icPhone = icPhone;
  icPersonAdd = icPersonAdd;
  icCheck = icCheck;
  icMail = icMail;
  icAccessTime = icAccessTime;
  icHome = icHome;
  icMap = icMap;

  galleryId = 'myLightbox';
  galleries: GalleryItem[] = [];

  model: Asset;

  isLoading: boolean;
  additionalFields: any = []; // = new Map<string, AdditionalField>();

  @ViewChild('itemTemplate', { read: TemplateRef }) itemTemplate: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private assetSvc: AssetService,
    private gallery: Gallery) { }

  ngOnInit(): void {
    this.initModel();
  }

  private initModel() {
    this.route.paramMap
      .pipe(untilDestroyed(this))
      .subscribe(params => {
        const id = params.get('id');
        this.fetchData(id);
      });
  }

  private fetchData(id: string) {
    const galleryRef = this.gallery.ref(this.galleryId);
    galleryRef.reset();

    this.isLoading = true;
    const callModel = this.assetSvc.getById(id, 'pembina,location,status,photos');
    const callDetail = this.assetSvc.getDetail(id, { params: { mode: 'view' } });
    const multiCall = forkJoin([callModel, callDetail]);
    multiCall.pipe(finalize(() => this.isLoading = false)).subscribe(rs => {
      this.model = rs[0].data;

      this.galleries = [];
      galleryRef.reset();

      this.model.photos.forEach(p => {
        this.galleries.push({
          data: {
            thumb: p.file?.thumb,
            title: p.properties?.notes
          }
        });

        galleryRef.addImage({
          src: p.file?.url,
          thumb: p.file?.thumb,
          title: p.properties?.notes
        });
      });

      this.additionalFields = rs[1].data;
    });
  }
}
