import { Component, inject, OnInit, ChangeDetectorRef } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { MatChipsModule } from "@angular/material/chips"; 
import { AdminService, KeycloakUser } from "../admin.service";

@Component({
  selector: "app-admin-users",
  imports: [MatTableModule, MatChipsModule],
  templateUrl: "./admin-users.html",
  styleUrl: "./admin-users.scss",
})

export class AdminUsers implements OnInit {
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);

  users: KeycloakUser[] = [];
  displayedColumns: string[] = ["username", "email", "firstName", "lastName", "enabled", "roles"];

  ngOnInit() {
    this.adminService.getUsers().subscribe((data) => {
      this.users = data;
      this.cdr.markForCheck();
    });
  }
}