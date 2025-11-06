import { Body, Controller, Get, Patch, Post, Req, UnauthorizedException } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverLoginDto } from './dto/login.dto';
import { DriverUpdateDeliveryDto } from './dto/update-delivery.dto';
import { Request } from 'express';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('login')
  login(@Body() dto: DriverLoginDto) {
    return this.driverService.login(dto.identifier, dto.password);
  }

  @Get('assignments')
  assignments(@Req() req: Request) {
    const token = req.headers['x-auth-token'];
    if (typeof token !== 'string') {
      throw new UnauthorizedException('Missing session token');
    }
    return this.driverService.listAssignments(token);
  }

  @Patch('assignments/status')
  update(@Req() req: Request, @Body() dto: DriverUpdateDeliveryDto) {
    const token = req.headers['x-auth-token'];
    if (typeof token !== 'string') {
      throw new UnauthorizedException('Missing session token');
    }
    return this.driverService.updateDeliveryStatus(token, dto);
  }
}
