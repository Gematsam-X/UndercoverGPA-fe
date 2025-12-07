import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { bootstrapApplication } from "@angular/platform-browser";
import { App } from "./app/app";
import { appConfig } from "./app/app.config";
import { authInterceptor } from "./app/interceptors/auth.interceptor";

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), // preserva eventuali altri provider
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
}).catch((err) => console.error(err));
