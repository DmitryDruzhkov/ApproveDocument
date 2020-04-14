import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface AuthInfo {
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private currentUser$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(null);
  
  constructor() { }

  public setCurrentUser(user: AuthInfo): void {
    this.currentUser$.next(user);
  }

  public getUserName(): string | null {
    return this.currentUser$.getValue() ? this.currentUser$.getValue().userName : null;
  }

  public isLoggedIn(): boolean {
    return !!this.currentUser$.getValue() && !!this.currentUser$.getValue().userName;
  }
}
