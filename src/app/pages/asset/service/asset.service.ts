import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpParams, HttpRequest } from '@angular/common/http';
import { ApiConfig } from 'src/app/common/api.config';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GenericRs } from 'src/app/types/generic-rs.model';
import { Asset, AssetAudit, AssetMaintenance } from '../interfaces/asset.model';
import { UploadStatus, FilePreviewModel } from 'ngx-awesome-uploader';
@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private readonly URL = [ApiConfig.url, 'v1', 'asset'].join('/');

  constructor(private httpClient: HttpClient) { }

  public getAllList() {
    const params = new HttpParams().append('include', 'owner,status,category,location.type');
    return this.httpClient.get(this.URL, { params }) as Observable<GenericRs<Asset[]>>;
  }

  public getById(id: number | string, include?: string) {
    let params = new HttpParams();
    if (include !== undefined) { params = params.append('include', include); }
    return this.httpClient.get([this.URL, id].join('/'), { params }) as Observable<GenericRs<Asset>>;
  }

  public delete(id: number | string) {
    return this.httpClient.delete(`${this.URL}/${id}`) as Observable<GenericRs<Asset>>;
  }

  public saveOrUpdate(asset: Asset) {
    if (asset.id) {
      return this.httpClient.put([this.URL, asset.id].join('/'), asset) as Observable<GenericRs<Asset>>;
    } else {
      return this.httpClient.post(this.URL, asset) as Observable<GenericRs<Asset>>;
    }
  }

  public uploadFile(id: string | number, fileItem: FilePreviewModel) {
    const form = new FormData();
    form.append('file', fileItem.file);
    const api = [this.URL, id, 'upload'].join('/');
    const req = new HttpRequest('POST', api, form, { reportProgress: true });
    return this.httpClient.request(req).pipe(
      map((res: HttpEvent<any>) => {
        if (res.type === HttpEventType.Response) {
          const responseFromBackend = res.body;
          return {
            body: responseFromBackend,
            status: UploadStatus.UPLOADED
          };
        } else if (res.type === HttpEventType.UploadProgress) {
          /** Compute and show the % done: */
          const uploadProgress = +Math.round((100 * res.loaded) / res.total);
          return {
            status: UploadStatus.IN_PROGRESS,
            progress: uploadProgress
          };
        }
      }),
      catchError(er => {
        console.log(er);
        return of({ status: UploadStatus.ERROR, body: er });
      })
    );
  }

  // Asset Audit
  public deleteAudit(id: number | string) {
    return this.httpClient.delete(`${this.URL}/audit/${id}`) as Observable<GenericRs<void>>;
  }

  saveOrUpdateAudit(model: AssetAudit) {
    if (model.id) {
      return this.httpClient.put([`${this.URL}/audit`, model.id].join('/'), model) as Observable<GenericRs<AssetAudit>>;
    } else {
      return this.httpClient.post(`${this.URL}/audit`, model) as Observable<GenericRs<AssetAudit>>;
    }
  }

  // Asset Maintenance
  saveOrUpdateMaintenance(model: AssetMaintenance) {
    if (model.id) {
      return this.httpClient.put([`${this.URL}/maintenance`, model.id].join('/'), model) as Observable<GenericRs<AssetMaintenance>>;
    } else {
      return this.httpClient.post(`${this.URL}/maintenance`, model) as Observable<GenericRs<AssetMaintenance>>;
    }
  }

  public deleteMaintenance(id: number | string) {
    return this.httpClient.delete(`${this.URL}/maintenance/${id}`) as Observable<GenericRs<void>>;
  }

}
