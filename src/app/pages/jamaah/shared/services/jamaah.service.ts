import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiConfig } from 'src/app/core/common/api.config';
import { Observable } from 'rxjs';
import { Jamaah } from '../interfaces/jamaah.model';
import * as _ from 'lodash';
import { GenericRs } from 'src/app/shared/types/generic-rs.model';
import { AdditionalField } from 'src/app/shared/types/additional-field.interface';
import { SharedProperty } from 'src/app/shared/types/shared-property.interface';
import { Pembina } from 'src/app/shared/types/pembina.interface';

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

  public getDetail(id: number | string, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
  }) {
    return this.httpClient.get([this.URL, id, 'detail'].join('/'), options) as Observable<GenericRs<SharedProperty[]>>;
  }

  public getPembina(id: number | string) {
    return this.httpClient.get<GenericRs<Pembina>>([this.URL, id, 'pembina'].join('/'));
  }
}
