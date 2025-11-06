import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AdminService } from './admin.service';
import { Request } from 'express';
import { AdminAuthGuard } from './admin.guard';
import { ManageUserDto } from './dto/manage-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../common/in-memory.database';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.adminService.login(body.identifier, body.password);
  }

  @Post('logout')
  logout(@Req() req: Request) {
    const token = req.headers['x-auth-token'];
    if (typeof token === 'string') {
      this.adminService.logout(token);
    }
    return { success: true };
  }

  @Get('users')
  @UseGuards(AdminAuthGuard)
  listUsers(@Query('role') role?: UserRole) {
    return this.adminService.listUsers(role);
  }

  @Post('users')
  @UseGuards(AdminAuthGuard)
  createUser(@Body() dto: ManageUserDto) {
    return this.adminService.createUser(dto);
  }

  @Patch('users/:id')
  @UseGuards(AdminAuthGuard)
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.adminService.updateUser(id, dto);
  }

  @Delete('users/:id')
  @UseGuards(AdminAuthGuard)
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }
}
