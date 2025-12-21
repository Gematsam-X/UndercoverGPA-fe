import { Routes } from "@angular/router";
import { EmailFound } from "./email-found/email-found";
import { authGuard } from "./guards/auth.guard";
import { Homepage } from "./homepage/homepage";
import { Login } from "./login/login";
import { NewVote } from "./new-vote/new-vote";
import { Register } from "./register/register";
import { ManageVotesComponent } from "./manage-votes/manage-votes";
import { IndividualAverages } from "./individual-averages/individual-averages";
import { AccountPage } from "./account-page/account-page";

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "login", component: Login },
  { path: "register", component: Register },
  { path: "email-found", component: EmailFound },
  { path: "home", component: Homepage, canActivate: [authGuard] },
  { path: "new-vote", component: NewVote, canActivate: [authGuard] },
  { path: "manage-votes", component: ManageVotesComponent, canActivate: [authGuard] },
  { path: "individual-averages", component: IndividualAverages, canActivate: [authGuard] },
  { path: "account-page", component: AccountPage, canActivate: [authGuard] },
];
