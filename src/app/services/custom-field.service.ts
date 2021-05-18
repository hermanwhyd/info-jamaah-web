import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericRs } from 'src/app/types/generic-rs.model';
import { ApiConfig } from '../common/api.config';
import { CustomField } from '../types/custom-field.model';

@Injectable({
  providedIn: 'root'
})
export class CustomFieldService {

  private readonly URL = ApiConfig.url + '/v1/custom-field';

  constructor(private httpClient: HttpClient) { }

  public findByGroupId(groupId: number, include?: string) {
    let params = new HttpParams();
    if (include !== undefined) { params = params.append('include', include); }
    return this.httpClient.get([this.URL, 'group', groupId].join('/'), { params }) as Observable<GenericRs<CustomField[]>>;
  }

  public update(bodyRq: CustomField[]): Observable<GenericRs<void>> {
    return this.httpClient.put([this.URL, 'batch-update'].join('/'), bodyRq) as Observable<GenericRs<void>>;
  }

  public saveOrUpdate(model: CustomField) {
    if (model.id) {
      return this.httpClient.put([this.URL, model.id].join('/'), model) as Observable<GenericRs<CustomField>>;
    } else {
      return this.httpClient.post(this.URL, model) as Observable<GenericRs<CustomField>>;
    }
  }

  public delete(id: number) {
    return this.httpClient.delete([this.URL, id].join('/')) as Observable<GenericRs<void>>;
  }
}
