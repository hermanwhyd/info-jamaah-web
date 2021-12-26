import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/core/common/api.config';
import { GenericRs } from '../types/generic-rs.model';
import { Tag } from '../types/tag.interface';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private readonly URL = [ApiConfig.url, 'v1', 'tag'].join('/');

  constructor(private httpClient: HttpClient) { }

  public findByGroup(group: string) {
    return this.httpClient.get([this.URL, 'group', group].join('/')) as Observable<GenericRs<Tag[]>>;
  }

  delete(id: number) {
    return this.httpClient.delete([this.URL, id].join('/')) as Observable<GenericRs<void>>;
  }

  saveOrUpdate(model: Tag) {
    if (model.id) {
      return this.httpClient.put([this.URL, model.id].join('/'), model) as Observable<GenericRs<Tag>>;
    } else {
      return this.httpClient.post(this.URL, model) as Observable<GenericRs<Tag>>;
    }
  }

}
