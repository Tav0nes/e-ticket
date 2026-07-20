import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideKeycloak, includeBearerTokenInterceptor, INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG } from 'keycloak-angular';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideKeycloak({
      config: {
        url: environment.keycloakUrl,
        realm: 'eticket',
        clientId: 'eticket-frontend'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
      }
    }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([includeBearerTokenInterceptor])
    ),
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, useValue: [
        {
          urlPattern: new RegExp('^' + environment.apiUrl.replace(/\./g, '\\.') + '/.*'),
        }
      ]
    }
  ]
};
