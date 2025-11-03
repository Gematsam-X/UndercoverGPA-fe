import { authGuard } from './guards/auth.guard';
import { Routes } from '@angular/router';
import { Login } from './login/login';
import { EmailFound } from './email-found/email-found';
import { Homepage } from './homepage/homepage';
import { NewVote } from './new-vote/new-vote';
import { Register } from './register/register';
import { PageCore } from './page-core/page-core';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'email-found', component: EmailFound },
  { path: 'home', component: Homepage, canActivate: [authGuard] },
  { path: 'new-vote', component: NewVote, canActivate: [authGuard] },
  { path: 'page-core', component: PageCore, canActivate: [authGuard] },
];
