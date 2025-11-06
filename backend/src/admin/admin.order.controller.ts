import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateDeliveryStatusDto, UpdateOrderStatusDto } from './dto/order.dto';
import { AdminAuthGuard } from './admin.guard';

@Controller('admin/orders')
@UseGuards(AdminAuthGuard)
export class AdminOrderController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  listOrders() {
    return this.adminService.listOrders();
  }

  @Post('update')
  updateOrder(@Body() dto: UpdateOrderStatusDto) {
    return this.adminService.updateOrder(dto);
  }

  @Get('deliveries')
  listDeliveries() {
    return this.adminService.listDeliveries();
  }

  @Post('deliveries/update')
  updateDelivery(@Body() dto: UpdateDeliveryStatusDto) {
    return this.adminService.updateDelivery(dto);
  }
}
