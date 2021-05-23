import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { EMPTY, Observable } from 'rxjs';
import { map, publishReplay, refCount, catchError } from 'rxjs/operators';
import { GenericRs } from 'src/app/types/generic-rs.model';
import { SharedProperty } from 'src/app/types/shared-property.interface';
import { ApiConfig } from '../common/api.config';

@Injectable({
  providedIn: 'root'
})
export class SharedPropertyService {

  private STORAGE_KEY = 'dashboard-greeting';

  private readonly URL = ApiConfig.url + '/v1/shared-props';
  private readonly URL_BANNER = ApiConfig.url + '/v1/banner';
  cache = {};

  constructor(private httpClient: HttpClient, @Inject(LOCAL_STORAGE) private _storage: StorageService) { }

  public storeSharePropCache(types: SharedProperty[]) {
    this._storage.set(this.STORAGE_KEY, types);
  }

  public getSharedPropCache(): SharedProperty[] {
    return this._storage.get(this.STORAGE_KEY) || [] as SharedProperty[];
  }

  public findFullByGroup(group: string, include?: string) {
    let params = new HttpParams().append('mode', 'edit');
    if (include !== undefined) { params = params.append('include', include); }
    return this.httpClient.get([this.URL, 'group', group].join('/'), { params }) as Observable<GenericRs<SharedProperty[]>>;
  }

  public findByGroup(group: string, include?: string) {
    const params = include ? { include } : null;

    if (!this.cache[group]) {
      this.cache[group] = this.httpClient.get([this.URL, 'group', group].join('/'), { params })
        .pipe(
          map(data => data),
          publishReplay(1),
          refCount(),
          catchError(err => {
            this.deleteCacheItem(group);
            return EMPTY;
          })
        );
    }

    return this.cache[group] as Observable<GenericRs<SharedProperty[]>>;
  }

  public findByModel(model: string) {
    if (!this.cache[model]) {
      this.cache[model] = this.httpClient.get([this.URL, 'options', model].join('/'))
        .pipe(
          map(data => data),
          publishReplay(1),
          refCount()
        );
    }

    return this.cache[model] as Observable<GenericRs<SharedProperty[]>>;
  }

  public update(bodyRq: SharedProperty[]): Observable<GenericRs<void>> {
    return this.httpClient.put([this.URL, 'batch-update'].join('/'), bodyRq) as Observable<GenericRs<void>>;
  }

  public deleteCacheItem(key: string) {
    delete this.cache[key];
  }

  public saveOrUpdate(model: SharedProperty) {
    if (model.id) {
      return this.httpClient.put([this.URL, model.id].join('/'), model) as Observable<GenericRs<SharedProperty>>;
    } else {
      return this.httpClient.post(this.URL, model) as Observable<GenericRs<SharedProperty>>;
    }
  }

  public uploadImage(fd: FormData) {
    return this.httpClient.post(this.URL_BANNER, fd) as Observable<GenericRs<SharedProperty>>;
  }

  public delete(id: number) {
    return this.httpClient.delete([this.URL, id].join('/')) as Observable<GenericRs<void>>;
  }

  public getSelectOptions(selector: string, include?: string) {
    let params = new HttpParams();
    if (include !== undefined) { params = params.append('include', include); }
    return this.httpClient.get([this.URL, 'options', selector].join('/'), { params }) as Observable<GenericRs<any>>;
  }
}
