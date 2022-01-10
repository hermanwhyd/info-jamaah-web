import { Observable } from 'rxjs';
import { FilePickerAdapter, UploadResponse, FilePreviewModel } from 'ngx-awesome-uploader';
import { Jamaah } from '../interfaces/jamaah.model';
import { JamaahService } from './jamaah.service';
import { MediaService } from 'src/app/shared/services/media.service';

export class JamaahFilePickerAdapter extends FilePickerAdapter {

  constructor(private model: Jamaah, private jamaahSvc: JamaahService, private mediaSvc: MediaService) {
    super();
  }

  public uploadFile(fileItem: FilePreviewModel): Observable<UploadResponse> {
    return this.jamaahSvc.uploadFile(this.model.id, fileItem);
  }

  public removeFile(fileItem: FilePreviewModel): Observable<any> {
    return this.mediaSvc.delete(fileItem.uploadResponse.uuid);
  }

}
