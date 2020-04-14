import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { AuthorizationService } from './authorization.service';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthorizationService,
    private router: Router
  ) {}
  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> {
    if (this.auth.isLoggedIn()) {
      return of(true);
    } else {
      this.router.navigate(['login'], {state: {redirectUrl: state.url}});
    }
  }
}
