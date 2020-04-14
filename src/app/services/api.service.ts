import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DocumentApproval, ApprovedState } from '../models/approval';
import { agreement } from '../models/document';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  getDocument(): Observable<string> {
    return of(agreement);
  }

  setApprovedState(approvalResult: DocumentApproval): Observable<number> {
    return of(approvalResult.state);
  }
}
