import { Component, OnInit } from '@angular/core';
import { Link } from 'src/@vex/interfaces/link.interface';
import { scaleIn400ms } from '../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../@vex/animations/fade-in-right.animation';

import icAttachFile from '@iconify/icons-ic/twotone-attach-file';
import icArrowBack from '@iconify/icons-ic/arrow-back';

import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AssetService } from '../service/asset.service';
import { Asset } from '../interfaces/asset.model';
import { MatDialog } from '@angular/material/dialog';
import { AssetUploadComponent } from '../asset-upload/asset-upload.component';

@UntilDestroy()
@Component({
  selector: 'vex-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.scss'],
  animations: [
    fadeInRight400ms,
    scaleIn400ms,
  ]
})
export class AssetDetailComponent implements OnInit {

  model: Asset;
  icArrowBack = icArrowBack;
  icAttachFile = icAttachFile;

  links: Link[] = [
    {
      label: 'Details',
      route: './',
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Maintenances',
      route: './maintenances',
    },
    {
      label: 'Audits',
      route: './audits',
    },
    {
      label: 'Files',
      route: './files',
    }
  ];

  constructor(private route: ActivatedRoute,
    private assetSvc: AssetService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initModel();
  }

  private initModel() {
    this.route.paramMap
      .pipe(untilDestroyed(this))
      .subscribe(params => {
        const id = params.get('id');
        this.assetSvc.getById(id).subscribe(g => {
          this.model = g.data;
        });
      });
  }

  uploadFile() {
    this.dialog.open(AssetUploadComponent, {
      data: { model: this.model },
      width: '500px',
    })
      .afterClosed().subscribe((isSuccess: boolean) => {
        console.log(isSuccess);
      });
  }

}
