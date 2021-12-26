import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MainGuard implements CanActivateChild, CanLoad, CanActivate {

  EXCLUSION_URL_WL = ['/logout'];

  constructor(private authService: AuthService, private router: Router) { }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return !this.authService.isTokenExpired();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivateChild(route, state);
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (next.url.length === 0) { return true; }
    if (!this.authService.isTokenExpired()) {
      const data = next.data;
      const datas = Object.keys(data).map(it => data[it]);
      const result = datas.length === 0 || this.authService.hasAccess(datas);

      if (!result) {
        this.router.navigate(['/no-access']);
      }
      return result;
    }

    // not logged in so redirect to login page with the return url
    const returnUrl = this.EXCLUSION_URL_WL.includes(state.url) ? null : state.url;
    this.router.navigate(['/login'], { queryParams: { returnUrl } });
    return false;
  }
}
