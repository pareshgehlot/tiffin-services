import { Body, Controller, Post, Req } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AdminService } from './admin.service';
import { Request } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.adminService.login(body.email, body.password);
  }

  @Post('logout')
  logout(@Req() req: Request) {
    const token = req.headers['x-auth-token'];
    if (typeof token === 'string') {
      this.adminService.logout(token);
    }
    return { success: true };
  }
}
