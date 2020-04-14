import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthorizationService } from '../services/authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationComponent {

  authForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authorizationService: AuthorizationService
  ) {
    this.authForm = this.getAuthForm();
  }

  getAuthForm(): FormGroup {
    return this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.authorizationService.setCurrentUser({
      userName: this.authForm.value.login
    });
    this.router.navigate(['']);
  }
}
