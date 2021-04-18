import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import icClose from '@iconify/icons-ic/twotone-close';
import icPdf from '@iconify/icons-fa-solid/file-pdf';
import icWord from '@iconify/icons-fa-solid/file-word';
import icExcel from '@iconify/icons-fa-solid/file-excel';

import { FilePickerComponent, FilePreviewModel, UploaderCaptions, ValidationError } from 'ngx-awesome-uploader';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { AssetFilePickerAdapter } from '../service/asset-file-pircker.adapter';
import { Asset } from '../interfaces/asset.model';
import { AssetService } from '../service/asset.service';

@Component({
  selector: 'vex-asset-upload',
  templateUrl: './asset-upload.component.html',
  styleUrls: ['./asset-upload.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AssetUploadComponent implements OnInit {
  submitted = false;

  icClose = icClose;
  icPdf = icPdf;
  icWord = icWord;
  icExcel = icExcel;

  model: Asset;

  fileExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'xlsx', 'docsx'];

  @ViewChild('uploader', { static: true }) uploader: FilePickerComponent;
  public adapter: any;
  public myFiles: FilePreviewModel[] = [];
  captions: UploaderCaptions = {
    dropzone: {
      title: 'Drag dan drop file disini',
      or: 'atau',
      browse: 'Cari File'
    },
    cropper: {
      crop: 'Crop',
      cancel: 'Batal'
    },
    previewCard: {
      remove: 'Hapus',
      uploadError: 'Gagal mengupload'
    }
  };

  constructor(@Inject(MAT_DIALOG_DATA) private data: any
    , private dialogRef: MatDialogRef<AssetUploadComponent>
    , private snackBar: MatSnackBar
    , private assetSvc: AssetService) { }

  ngOnInit(): void {
    this.model = this.data.model;
    this.adapter = new AssetFilePickerAdapter(this.model, this.assetSvc);
  }

  public onValidationError(error: ValidationError): void {
    let message: string;
    if (error.error === 'EXTENSIONS') {
      message = `File yang diperbolehkan hanya : ${this.fileExtensions.join(', ')}`;
    } else {
      message = `Gagal validasi : ${error.error} in ${error.file.name}`;
    }

    this.snackBar.openFromComponent(
      SnackbarNotifComponent, { data: { message, type: 'danger' } }
    );
  }

  public onUploadSuccess(e: FilePreviewModel): void {
    console.log(e);
    console.log(this.myFiles);
  }

  public onRemoveSuccess(e: FilePreviewModel) {
    console.log(e);
  }

  public onFileAdded(file: FilePreviewModel) {
    this.myFiles.push(file);
  }

}
