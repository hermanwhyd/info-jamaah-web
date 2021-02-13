import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiConfig } from 'src/app/common/api.config';
import { Observable } from 'rxjs';
import { GenericRs } from 'src/app/types/generic-rs.model';
import { Asset } from '../interfaces/asset.model';

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

  public deleteMaintenance(id: number | string) {
    return this.httpClient.delete(`${this.URL}/maintenance/${id}`) as Observable<GenericRs<void>>;
  }

  public deleteAudit(id: number | string) {
    return this.httpClient.delete(`${this.URL}/audit/${id}`) as Observable<GenericRs<void>>;
  }

  public deleteMedia(id: number | string) {
    return this.httpClient.delete(`${this.URL}/media/${id}`) as Observable<GenericRs<void>>;
  }

  public saveOrUpdate(asset: Asset) {
    if (asset.id) {
      return this.httpClient.put([this.URL, asset.id].join('/'), asset) as Observable<GenericRs<Asset>>;
    } else {
      return this.httpClient.post(this.URL, asset) as Observable<GenericRs<Asset>>;
    }
  }

}
