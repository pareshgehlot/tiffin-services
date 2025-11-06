import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminMenuController } from './admin.menu.controller';
import { AdminPlanController } from './admin.plan.controller';
import { AdminPromotionController } from './admin.promotion.controller';
import { AdminOrderController } from './admin.order.controller';
import { AdminSettingsController } from './admin.settings.controller';
import { AdminService } from './admin.service';
import { DatabaseModule } from '../common/database.module';
import { AdminAuthGuard } from './admin.guard';

@Module({
  imports: [DatabaseModule],
  controllers: [
    AdminController,
    AdminMenuController,
    AdminPlanController,
    AdminPromotionController,
    AdminOrderController,
    AdminSettingsController
  ],
  providers: [AdminService, AdminAuthGuard],
  exports: [AdminService]
})
export class AdminModule {}
