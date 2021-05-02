import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from '../common/api.config';
import { AssetMedia } from '../pages/asset/interfaces/asset.model';
import { GenericRs } from '../types/generic-rs.model';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly URL = [ApiConfig.url, 'v1', 'media'].join('/');

  constructor(private httpClient: HttpClient) { }

  public downloadSigle(uuid: string) {
    return this.httpClient.get([this.URL, uuid, 'download'].join('/'), { responseType: 'blob' }) as Observable<any>;
  }

  public delete(uuid: string) {
    return this.httpClient.delete(`${this.URL}/${uuid}`) as Observable<GenericRs<void>>;
  }

  public saveOrUpdate(model: AssetMedia) {
    if (model.uuid) {
      return this.httpClient.put([this.URL, model.uuid].join('/'), model) as Observable<GenericRs<AssetMedia>>;
    } else {
      return this.httpClient.post(this.URL, model) as Observable<GenericRs<AssetMedia>>;
    }
  }
}
