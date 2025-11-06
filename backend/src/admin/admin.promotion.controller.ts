import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpsertPromotionDto } from './dto/promotion.dto';
import { AdminAuthGuard } from './admin.guard';

@Controller('admin/promotions')
@UseGuards(AdminAuthGuard)
export class AdminPromotionController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  list() {
    return this.adminService.getPromotions();
  }

  @Post('upsert')
  upsert(@Body() dto: UpsertPromotionDto) {
    return this.adminService.upsertPromotion(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.deletePromotion(id);
  }
}
