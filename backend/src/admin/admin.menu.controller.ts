import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpsertTiffinDto } from './dto/tiffin.dto';
import { SetWeeklyMenuDto } from './dto/weekly-menu.dto';
import { AdminAuthGuard } from './admin.guard';

@Controller('admin/tiffins')
@UseGuards(AdminAuthGuard)
export class AdminMenuController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  list() {
    return this.adminService.listTiffins();
  }

  @Post('upsert')
  upsert(@Body() dto: UpsertTiffinDto) {
    return this.adminService.upsertTiffin(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.deleteTiffin(id);
  }

  @Get('weekly/menu')
  getWeeklyMenu() {
    return this.adminService.getWeeklyMenu();
  }

  @Post('weekly/menu')
  setWeeklyMenu(@Body() dto: SetWeeklyMenuDto) {
    return this.adminService.setWeeklyMenu(dto.entries);
  }
}
