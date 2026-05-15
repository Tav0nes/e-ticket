import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import Keycloak from 'keycloak-js';

type NavLink = { label: string, route: string, icon: string; roles?: string[] };
type NavGroup = { label: string, icon: string, children: NavLink[] };
type NavEntry = NavLink | NavGroup;

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule, 
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  private keycloak = inject(Keycloak);

  readonly sidenavOpen = signal(true);
  readonly openGroups = signal<Set<string>>(new Set(['Tickets']));

  readonly navItems: NavEntry[] = [
    { label: 'Home', icon: 'home', route: '/home' },
    {
      label: 'Tickets', 
      icon: 'confirmation_number',
      children: [
        { label: 'New', icon: 'add', route: '/ticket/new', roles: ['reporter','engineer', 'admin'] },
        { label: 'All Tickets', icon: 'list', route: '/tickets'},
        { label: 'Unassigned', icon: 'person_off', route:'/unassigned-tickets' },
        { label: 'Search Archive', icon: 'search', route:'/search-archive' },
      ],
    },
    {
      label: 'Support',
      icon: 'help_outline',
      children: [
        { label: 'Admin Panel', icon: 
          'admin_panel_settings', route: '/admin-panel', roles: ['admin'] },
        { label: 'Changelog', icon: 'history', route: '/changelog' },
        { label: 'FAQ', icon: 'help', route: '/faq' },
        { label: 'Contact Us', icon: 'contact_mail', route: '/contact-us' },
      ],
    },
  ];

  get authenticated(): boolean {
    return this.keycloak.authenticated ?? false;
  } 

  get username(): string {
    return this.keycloak.tokenParsed?.['preferred_username'] ?? '';
  }

  isGroup(item: NavEntry): item is NavGroup {
    return 'children' in item;
  }

  isGroupOpen(label: string): boolean {
    return this.openGroups().has(label);
  }

  toggleGroup(label: string): void {
    this.openGroups.update((groups) => {
      const next = new Set(groups);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  canSee(item: NavLink): boolean {
    if (!item.roles) {
      return true;
    }
    const realmRoles = (this.keycloak.tokenParsed?.['realm_access'] as { roles?: string[] } | undefined)?.roles ?? [];
    return item.roles.some((r) => realmRoles.includes(r));
  }

  toggleSidenav(): void {
    this.sidenavOpen.update((open) => !open);
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }
}
