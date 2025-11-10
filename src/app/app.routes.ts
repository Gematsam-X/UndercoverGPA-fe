import { Routes } from "@angular/router";
import { EmailFound } from "./email-found/email-found";
import { authGuard } from "./guards/auth.guard";
import { Homepage } from "./homepage/homepage";
import { Login } from "./login/login";
import { NewVote } from "./new-vote/new-vote";
import { Register } from "./register/register";

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "login", component: Login },
  { path: "register", component: Register },
  { path: "email-found", component: EmailFound },
  { path: "home", component: Homepage, canActivate: [authGuard] },
  { path: "new-vote", component: NewVote, canActivate: [authGuard] },
];
