import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import Keycloak from 'keycloak-js';
import { HasRolesDirective } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, HasRolesDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private keycloak = inject(Keycloak);

  get authenticated(): boolean {
    return this.keycloak.authenticated ?? false;
  }

  get username(): string {
    return this.keycloak.tokenParsed?.['preferred_username'] ?? '';
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }
}
