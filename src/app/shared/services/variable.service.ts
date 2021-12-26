import { HttpClient } from '@angular/common/http';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/core/common/api.config';
import { GenericRs } from '../types/generic-rs.model';

@Injectable({
  providedIn: 'root'
})
export class VariableService {

  private readonly URL = [ApiConfig.url, 'v1', 'variable'].join('/');

  constructor(private httpClient: HttpClient) { }

  public findByGroup(group: string) {
    return this.httpClient.get([this.URL, 'group', group].join('/')) as Observable<GenericRs<Variable[]>>;
  }

}
