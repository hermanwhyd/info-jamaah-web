import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericRs } from 'src/app/shared/types/generic-rs.model';
import { environment } from 'src/environments/environment';
import { Jamaah } from '../../jamaah/interfaces/jamaah.model';
import { Kepengurusan } from './kepengurusan.interface';
import { Pembina } from './pembina.interface';

const URL = [environment.apiUrl, 'v1', 'pembina'].join('/');

@Injectable({
  providedIn: 'root'
})
export class PembinaService {
  constructor(
    private httpClient: HttpClient
  ) { }

  getAll() {
    return this.httpClient.get<GenericRs<Pembina>>(URL);
  }

  getOverview(pembinaEnum: string, include?: string) {
    let params = new HttpParams();
    if (include !== undefined) { params = params.append('include', include); }

    return this.httpClient.get<GenericRs<Pembina>>([URL, pembinaEnum, 'overview'].join('/'), { params });
  }

  getKepengurusan(pembinaEnum: string, include?: string) {
    let params = new HttpParams();
    if (include !== undefined) { params = params.append('include', include); }

    return this.httpClient.get<GenericRs<Kepengurusan[]>>([URL, pembinaEnum, 'kepengurusan'].join('/'), { params });
  }

  removePengurus(pembinaEnum: string, id: number | string) {
    return this.httpClient.delete<GenericRs<void>>([URL, pembinaEnum, 'kepengurusan', id].join('/'));
  }

  getPengurusCandidate(pembinaEnum: string, search?: string, lvPembinaanList?: any, pengurusEnum?: string, include?: string) {
    let params = new HttpParams();
    if (include !== undefined) { params = params.append('include', include); }
    if (lvPembinaanList !== undefined) { params = params.append('lv_pembinaan', lvPembinaanList); }
    if (search !== undefined) { params = params.append('filter[full_name]', search); }
    if (pengurusEnum !== undefined) { params = params.append('dapukan_enum', pengurusEnum); }

    return this.httpClient.get<GenericRs<Jamaah[]>>([URL, pembinaEnum, 'kepengurusan', 'candidate'].join('/'), { params });
  }

  addPengurus(pembinaEnum: string, dapukanEnum: string, jamaahId: number) {
    return this.httpClient.post<GenericRs<Kepengurusan>>([URL, pembinaEnum, 'kepengurusan'].join('/'), {
      dapukanEnum,
      pembinaEnum,
      jamaahId
    });
  }
}
