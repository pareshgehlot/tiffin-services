import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdatePaymentSettingsDto } from './dto/payment-settings.dto';
import { UpdateIntegrationSettingsDto } from './dto/integration-settings.dto';
import { AdminAuthGuard } from './admin.guard';

@Controller('admin/settings')
@UseGuards(AdminAuthGuard)
export class AdminSettingsController {
  constructor(private readonly adminService: AdminService) {}

  @Get('payment')
  getPaymentSettings() {
    return this.adminService.getPaymentSettings();
  }

  @Post('payment')
  updatePaymentSettings(@Body() dto: UpdatePaymentSettingsDto) {
    return this.adminService.updatePaymentSettings(dto);
  }

  @Get('integrations')
  getIntegrationSettings() {
    return this.adminService.getIntegrationSettings();
  }

  @Post('integrations')
  updateIntegrationSettings(@Body() dto: UpdateIntegrationSettingsDto) {
    return this.adminService.updateIntegrationSettings(dto);
  }
}
