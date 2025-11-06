import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from './admin.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly adminService: AdminService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-auth-token'];
    if (typeof token !== 'string') {
      throw new UnauthorizedException('Missing authentication token');
    }
    const admin = this.adminService.validateToken(token);
    request.user = admin;
    return true;
  }
}
