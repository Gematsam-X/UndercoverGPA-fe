// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Login } from './login/login';
import { EmailFound } from './email-found/email-found';
import { Homepage } from './homepage/homepage';
import { Register } from './register/register';

export const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', component: Login },
	{ path: 'register', component: Register },
	{ path: 'email-found', component: EmailFound },
	{ path: 'home', component: Homepage },
];
