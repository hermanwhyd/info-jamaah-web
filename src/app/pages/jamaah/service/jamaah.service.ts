import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiConfig } from 'src/app/common/api.config';
import { Observable } from 'rxjs';
import { Jamaah } from '../interfaces/jamaah.model';
import * as _ from 'lodash';
import { GenericRs } from 'src/app/types/generic-rs.model';
import { AdditionalField } from 'src/app/types/additional-field.interface';

@Injectable({
  providedIn: 'root'
})
export class JamaahService {

  private readonly URL = [ApiConfig.url, 'v1', 'jamaah'].join('/');

  constructor(private httpClient: HttpClient) { }

  public getJamaahList(): Observable<GenericRs<Jamaah[]>> {
    const params = new HttpParams().append('include', 'lvPembinaan');
    return this.httpClient.get(this.URL, { params }) as Observable<GenericRs<Jamaah[]>>;
  }

  public getById(id: number | string, include?: string) {
    let params = new HttpParams();
    if (include !== undefined) { params = params.append('include', include); }
    return this.httpClient.get([this.URL, id].join('/'), { params }) as Observable<GenericRs<Jamaah>>;
  }

  public delete(id: number | string): Observable<GenericRs<Jamaah>> {
    return this.httpClient.delete(`${this.URL}/${id}`) as Observable<GenericRs<Jamaah>>;
  }

  public saveOrUpdate(jamaah: Jamaah): Observable<GenericRs<Jamaah>> {
    if (jamaah.id) {
      return this.httpClient.put([this.URL, jamaah.id].join('/'), jamaah) as Observable<GenericRs<Jamaah>>;
    } else {
      return this.httpClient.post(this.URL, jamaah) as Observable<GenericRs<Jamaah>>;
    }
  }

  public createDetail(id: number, value: AdditionalField) {
    return this.httpClient.post([this.URL, id, 'detail'].join('/'), value) as Observable<GenericRs<AdditionalField>>;
  }

}
