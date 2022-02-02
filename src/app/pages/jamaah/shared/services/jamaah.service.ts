import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { ApiConfig } from 'src/app/core/common/api.config';
import { Observable, of } from 'rxjs';
import { Jamaah } from '../interfaces/jamaah.model';
import * as _ from 'lodash';
import { GenericRs } from 'src/app/shared/types/generic-rs.model';
import { AdditionalField } from 'src/app/shared/types/additional-field.interface';
import { SharedProperty } from 'src/app/shared/types/shared-property.interface';
import { Pembina } from 'src/app/shared/types/pembina.interface';
import { FilePreviewModel, UploadStatus } from 'ngx-awesome-uploader';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JamaahService {

  private readonly URL = [ApiConfig.url, 'v1', 'jamaah'].join('/');

  constructor(private httpClient: HttpClient) { }

  public getJamaahList(): Observable<GenericRs<Jamaah[]>> {
    const params = new HttpParams().append('include', 'lvPembinaan');
    return this.httpClient.get<GenericRs<Jamaah[]>>(this.URL, { params });
  }

  public getById(id: number | string, include?: string) {
    let params = new HttpParams();
    if (include !== undefined) { params = params.append('include', include); }
    return this.httpClient.get<GenericRs<Jamaah>>([this.URL, id].join('/'), { params });
  }

  public delete(id: number | string): Observable<GenericRs<Jamaah>> {
    return this.httpClient.delete<GenericRs<Jamaah>>(`${this.URL}/${id}`);
  }

  public saveOrUpdate(jamaah: Jamaah): Observable<GenericRs<Jamaah>> {
    if (jamaah.id) {
      return this.httpClient.put<GenericRs<Jamaah>>([this.URL, jamaah.id].join('/'), jamaah);
    } else {
      return this.httpClient.post<GenericRs<Jamaah>>(this.URL, jamaah);
    }
  }

  public createDetail(id: number, value: AdditionalField) {
    return this.httpClient.post<GenericRs<AdditionalField>>([this.URL, id, 'detail'].join('/'), value);
  }

  public getDetail(id: number | string, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
  }) {
    return this.httpClient.get<GenericRs<SharedProperty[]>>([this.URL, id, 'detail'].join('/'), options);
  }

  public getPembina(id: number | string) {
    return this.httpClient.get<GenericRs<Pembina>>([this.URL, id, 'pembina'].join('/'));
  }

  public uploadFile(id: string | number, fileItem: FilePreviewModel) {
    const form = new FormData();
    form.append('file', fileItem.file);
    const api = [this.URL, id, 'photo'].join('/');
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
        return of({ status: UploadStatus.ERROR, body: er });
      })
    );
  }

}
