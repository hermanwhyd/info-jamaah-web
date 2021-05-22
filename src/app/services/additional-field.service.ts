import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericRs } from 'src/app/types/generic-rs.model';
import { ApiConfig } from '../common/api.config';
import { AdditionalField } from '../types/additional-field.interface';

@Injectable({
  providedIn: 'root'
})
export class AdditionalFieldService {

  private readonly URL = ApiConfig.url + '/v1/additional-field';

  constructor(private httpClient: HttpClient) { }

  public get(id: number) {
    return this.httpClient.get([this.URL, id].join('/')) as Observable<GenericRs<AdditionalField>>;
  }

  public update(bodyRq: AdditionalField) {
    return this.httpClient.put([this.URL, bodyRq.id].join('/'), bodyRq) as Observable<GenericRs<AdditionalField>>;
  }

  public delete(id: number) {
    return this.httpClient.delete([this.URL, id].join('/')) as Observable<GenericRs<void>>;
  }
}
