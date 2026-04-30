import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { Roles } from "../auth/roles.decorator";

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles('admin')
  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }
}