import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface UserOption {
  id: string;
  username: string;
  displayName: string;
}

@Injectable()
export class UsersService {
  private keycloakUrl: string;
  private realm = 'eticket';

  constructor(private configService: ConfigService) {
    this.keycloakUrl = this.configService.get<string>('KEYCLOAK_URL', 'http://localhost:8080');
  }

  async findAll(): Promise<UserOption[]> {
    const token = await this.getAdminToken();
    const response = await fetch(`${this.keycloakUrl}/admin/realms/${this.realm}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const users = await response.json();
    return users.filter((u: any) => u.enabled).map((u: any) => ({
      id: u.id,
      username: u.username,
      displayName: this.toDisplayName(u),
    }));
  }

  private toDisplayName(u: any): string {
    const parts = [u.firstName, u.lastName].filter(Boolean).join(' ').trim();
    return parts ? `${parts} (${u.username})` : u.username;
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
