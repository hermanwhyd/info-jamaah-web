import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from 'src/app/common/api.config';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
import * as _ from 'lodash';
import { GenericRs } from 'src/app/types/generic-rs.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly URL = [ApiConfig.url, 'v1', 'user'].join('/');

  constructor(private httpClient: HttpClient) { }

  public getUserList(include: string): Observable<GenericRs<User[]>> {
    const params = {
      include: (include !== undefined) ? include : null
    };
    return this.httpClient.get(this.URL, {params}) as Observable<GenericRs<User[]>>;
  }

  public getById(id: number | string, include?: string) {
    const params = {
      include: (include !== undefined) ? include : null
    };
    return this.httpClient.get([this.URL, id].join('/'), {params}) as Observable<GenericRs<User>>;
  }

  public delete(id: number | string): Observable<GenericRs<User>> {
    return this.httpClient.delete(`${this.URL}/${id}`) as Observable<GenericRs<User>>;
  }

  public saveOrUpdate(user: User): Observable<GenericRs<User>> {
    if (user.id) {
      return this.httpClient.put([this.URL, user.id].join('/'), user) as Observable<GenericRs<User>>;
    } else {
      return this.httpClient.post(this.URL, user) as Observable<GenericRs<User>>;
    }
  }

  public isUsernameAvailable(username: string): boolean {
    return true;
  }

}
