import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface KeycloakUser {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  enabled: boolean;
  realmRoles?: string[];
}

@Injectable()
export class AdminService {
  private keycloakUrl: string;
  private realm = 'eticket';

  constructor(private configService: ConfigService) {
    this.keycloakUrl = this.configService.get<string>('KEYCLOAK_URL', 'http://localhost:8080');
  }

  async getUsers(): Promise<KeycloakUser[]> {
    const token = await this.getAdminToken();
    const response = await fetch(
      `${this.keycloakUrl}/admin/realms/${this.realm}/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const users = await response.json();
    const usersWithRoles = await Promise.all(
      users.map(async (user: any) => {
        const rolesResponse = await fetch(
          `${this.keycloakUrl}/admin/realms/${this.realm}/users/${user.id}/role-mappings/realm`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const roles = await rolesResponse.json();

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          enabled: user.enabled,
          realmRoles: roles.map((role: any) => role.name).filter((roleName: string) => !roleName.startsWith('default-roles') && roleName !== 'offline_access' && roleName !== 'uma_authorization'),
        };
      })
    );
    return usersWithRoles;
  }

  private async getAdminToken(): Promise<string> {
    const response = await fetch(
      `${this.keycloakUrl}/realms/master/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: 'admin-cli',
          username: this.configService.get<string>('KEYCLOAK_ADMIN_USER', 'admin'),
          password: this.configService.get<string>('KEYCLOAK_ADMIN_PASSWORD', 'admin'),
          grant_type: 'password',
        }),
      },
    );
    const data = await response.json();
    return data.access_token;
  }
}
