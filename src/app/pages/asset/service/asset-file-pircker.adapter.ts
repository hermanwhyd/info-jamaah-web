import { Observable } from 'rxjs';
import { FilePickerAdapter, UploadResponse, FilePreviewModel } from 'ngx-awesome-uploader';
import { Asset } from '../interfaces/asset.model';
import { AssetService } from './asset.service';

export class AssetFilePickerAdapter extends FilePickerAdapter {
  constructor(private model: Asset, private assetSvc: AssetService) {
    super();
  }

  public uploadFile(fileItem: FilePreviewModel): Observable<UploadResponse> {
    return this.assetSvc.uploadFile(this.model.id, fileItem);
  }

  public removeFile(fileItem: FilePreviewModel): Observable<any> {
    return this.assetSvc.deleteMedia(fileItem.uploadResponse.id);
  }

}
