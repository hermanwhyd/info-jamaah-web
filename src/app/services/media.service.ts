import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from '../common/api.config';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly URL = [ApiConfig.url, 'v1', 'media'].join('/');

  constructor(private httpClient: HttpClient) { }

  public downloadSigle(uuid: string) {
    return this.httpClient.get([this.URL, uuid, 'download'].join('/'), { responseType: 'blob' }) as Observable<any>;
  }
}
