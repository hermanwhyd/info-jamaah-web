import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericRs } from 'src/app/shared/types/generic-rs.model';
import { environment } from 'src/environments/environment';
import { Family } from '../interfaces/family.intereface';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {

  private readonly URL = [environment.apiUrl, 'v1', 'family'].join('/');

  constructor(private httpClient: HttpClient) { }

  public getList() {
    const params = new HttpParams().append('include', 'kepalaKeluarga,membersCount');
    return this.httpClient.get<GenericRs<Family[]>>(this.URL, { params });
  }

  public getById(id: number | string, include?: string) {
    let params = new HttpParams();
    if (include !== undefined) { params = params.append('include', include); }
    return this.httpClient.get<GenericRs<Family>>([this.URL, id].join('/'), { params });
  }

  public delete(id: number | string) {
    return this.httpClient.delete<GenericRs<void>>(`${this.URL}/${id}`);
  }
}
