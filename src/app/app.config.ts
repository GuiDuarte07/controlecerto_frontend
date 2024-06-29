import { ApplicationConfig, LOCALE_ID, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { CookieService } from 'ngx-cookie-service';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { registerLocaleData } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

registerLocaleData(localePt);

const tokenInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    tokenInterceptorProvider,
    provideRouter(routes),
    provideHttpClient(),
    CookieService,
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR',
    }, provideAnimationsAsync(),
  ],
};
