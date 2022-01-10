import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import icClose from '@iconify/icons-ic/twotone-close';
import icPdf from '@iconify/icons-fa-solid/file-pdf';
import icWord from '@iconify/icons-fa-solid/file-word';
import icExcel from '@iconify/icons-fa-solid/file-excel';

import { FilePickerComponent, FilePreviewModel, UploaderCaptions, ValidationError } from 'ngx-awesome-uploader';
import { SnackbarNotifComponent } from 'src/app/shared/utilities/snackbar-notif/snackbar-notif.component';
import { MediaService } from 'src/app/shared/services/media.service';
import { JamaahService } from '../../../shared/services/jamaah.service';
import { JamaahFilePickerAdapter } from '../../../shared/services/jamaah-file-pircker.adapter';
import { Jamaah } from '../../../shared/interfaces/jamaah.model';

@Component({
  selector: 'vex-jamaah-upload',
  templateUrl: './jamaah-upload.component.html',
  styleUrls: ['./jamaah-upload.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JamaahUploadComponent implements OnInit {
  submitted = false;

  icClose = icClose;
  icPdf = icPdf;
  icWord = icWord;
  icExcel = icExcel;

  model: Jamaah;

  fileExtensions = ['jpg', 'jpeg', 'png'];

  @ViewChild('uploader', { static: true }) uploader: FilePickerComponent;
  public adapter: any;
  public myFiles: FilePreviewModel[] = [];
  captions: UploaderCaptions = {
    dropzone: {
      title: 'Drag dan drop foto disini',
      or: 'atau',
      browse: 'Cari File'
    },
    cropper: {
      crop: 'Crop',
      cancel: 'Batal'
    },
    previewCard: {
      remove: 'Hapus Foto',
      uploadError: 'Gagal mengupload'
    }
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private snackBar: MatSnackBar,
    private jamaahSvc: JamaahService,
    private mediaSvc: MediaService) { }

  ngOnInit(): void {
    this.model = this.data.model;
    this.adapter = new JamaahFilePickerAdapter(this.model, this.jamaahSvc, this.mediaSvc);
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

  public onUploadSuccess(file: FilePreviewModel): void {
    // change photo to default, then replace with actual
    this.model.avatar = null;
    this.model.avatar = file.uploadResponse?.file.thumb;
  }

  public onRemoveSuccess(file: FilePreviewModel) {
    this.model.avatar = null;
  }

  public onFileAdded(file: FilePreviewModel) {
    this.myFiles.push(file);
  }

}
