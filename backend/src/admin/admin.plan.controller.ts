import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpsertPlanDto } from './dto/plan.dto';
import { AdminAuthGuard } from './admin.guard';

@Controller('admin/plans')
@UseGuards(AdminAuthGuard)
export class AdminPlanController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  list() {
    return this.adminService.getPlans();
  }

  @Post('upsert')
  upsert(@Body() dto: UpsertPlanDto) {
    return this.adminService.upsertPlan(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.deletePlan(id);
  }
}
