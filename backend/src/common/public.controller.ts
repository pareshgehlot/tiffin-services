import { Controller, Get } from '@nestjs/common';
import { InMemoryDatabase } from './in-memory.database';

@Controller('public')
export class PublicController {
  constructor(private readonly db: InMemoryDatabase) {}

  @Get('tiffins')
  getTiffins() {
    return this.db.getTiffins();
  }

  @Get('weekly-menu')
  getWeeklyMenu() {
    return this.db.getWeeklyMenu();
  }

  @Get('plans')
  getPlans() {
    return this.db.getPlans();
  }

  @Get('promotions')
  getPromotions() {
    return this.db.getPromotions();
  }

  @Get('reviews')
  getReviews() {
    return this.db.getReviews();
  }

  @Get('payment-settings')
  getPaymentSettings() {
    return this.db.getPaymentSettings();
  }

  @Get('integration-settings')
  getIntegrationSettings() {
    return this.db.getIntegrationSettings();
  }
}
