import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthorizationService } from '../services/authorization.service';
import { ApprovedState, DocumentApproval, TextApprovedState } from '../models/approval';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ApproveDocument } from '../models/document';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { takeUntil, filter, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentComponent implements OnInit, OnDestroy {

  approveResult: BehaviorSubject<string> = new BehaviorSubject('');
  showedPDF: BehaviorSubject<string | SafeUrl> = new BehaviorSubject('');
  private onDestroy: Subject<null> = new Subject();
  approvalResult = '';
  approvalDocument: ApproveDocument = {
    src: ''
  };
  approveForm: FormGroup;
  resolutions: string[] = [
    'Полностью согласен', 'Согласен', 'Не согласен', 'Разрешаю красить в синий цвет'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private authorizationService: AuthorizationService,
    public sanitizer: DomSanitizer,
  ) {
    this.approveForm = this.getApproveForm();
  }

  ngOnInit(): void {
    this.apiService.getDocument().pipe(
      takeUntil(this.onDestroy),
      catchError(err => of('')),
      filter((base64: string) => !!base64)
    ).subscribe((base64: string) => {
      this.approvalDocument.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.getObjectUrl(base64) + '#toolbar=0&navpanes=0&scrollbar=0');
    });
  }

  getObjectUrl(base64: string): string {
    return URL.createObjectURL(this.getBlobFromBase64(base64.substr(base64.indexOf(',') + 1)));
  }

  getBlobFromBase64(base64: string): Blob {
    const byteCharacters = atob(base64);

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    return new Blob([byteArray], { type: 'application/pdf' });
  }

  getApproveForm(): FormGroup {
    return this.formBuilder.group({
      state: [0],
      resolution: ['', Validators.required],
      comment: ['']
    });
  }

  onSubmit(): void {
    const approvalState: DocumentApproval = {
      userName: this.authorizationService.getUserName(),
      state: +this.approveForm.value.state,
      resolution: this.approveForm.value.resolution,
      comment: this.approveForm.value.comment
    };

    this.sendDocumentApprovalState(approvalState);
  }

  sendDocumentApprovalState(approvalState: DocumentApproval): void {
    this.apiService.setApprovedState(approvalState).pipe(
      takeUntil(this.onDestroy),
    ).subscribe((state: number) => {
      const approvalState: ApprovedState = state ? ApprovedState.APPROVED : ApprovedState.DISAPPROVED;
      this.approveResult.next(TextApprovedState.get(approvalState));
    });
  }

  showPDF(): void {
    this.showedPDF.next(this.approvalDocument.src);
  }

  close(): void {
    this.showedPDF.next('');
  }

  ngOnDestroy() {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }
}
