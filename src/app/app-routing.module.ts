import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentComponent } from './document/document.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { AuthGuard } from './services/auth-guard.service';


const routes: Routes = [
  {
    path: '',
    component: DocumentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: AuthorizationComponent
  },
  {
    path: '**',
    component: DocumentComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
