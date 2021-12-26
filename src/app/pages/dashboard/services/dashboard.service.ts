import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/core/common/api.config';
import { GenericRs } from 'src/app/shared/types/generic-rs.model';
import { Variable } from 'src/app/shared/types/variable.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly URL = [ApiConfig.url, 'v1', 'dashboard'].join('/');

  constructor(private httpClient: HttpClient) { }

  private joiner(...str: any[]) {
    return [this.URL, ...str].join('/');
  }

  public evaluationDataFeeds(year: number) {
    const params = new HttpParams().append('include', 'diklat').append('year', year.toString());
    return this.httpClient.get(this.joiner('evaluation', 'data-feed'), { params }) as Observable<GenericRs<Variable[]>>;
  }
}
