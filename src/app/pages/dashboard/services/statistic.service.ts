import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/core/common/api.config';
import { GenericRs } from 'src/app/shared/types/generic-rs.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  private readonly URL = [ApiConfig.url, 'v1', 'statistic'].join('/');

  constructor(private httpClient: HttpClient) { }

  private joiner(...str: any[]) {
    return [this.URL, ...str].join('/');
  }

  public getBankDiklatDataFeed() {
    return this.httpClient.get(this.joiner('bank-diklat', 'dashboard-feeds')) as Observable<GenericRs<any>>;
  }

  public getSummaryEvaluation(id: number | string) {
    return this.httpClient.get(this.joiner('evaluation', id, 'summary-feeds')) as Observable<GenericRs<any>>;
  }

  public getSummaryQuestionnaire(id: number | string) {
    return this.httpClient.get(this.joiner('questionnaire', id, 'summary-feeds')) as Observable<GenericRs<any>>;
  }

}
