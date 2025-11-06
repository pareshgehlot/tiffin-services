import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InMemoryDatabase, MealPlan, PaymentSettings, Promotion, TiffinMenuItem, WeeklyMenuDay, IntegrationSettings, Order, Delivery } from '../common/in-memory.database';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AdminService {
  constructor(private readonly db: InMemoryDatabase) {}

  login(email: string, password: string) {
    const admin = this.db.getAdmin();
    if (admin.email === email && admin.password === password) {
      const token = uuid();
      this.db.addToken(token);
      return { token, email: admin.email };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  validateToken(token: string) {
    if (!token || !this.db.isTokenActive(token)) {
      throw new UnauthorizedException('Invalid or expired session token');
    }
  }

  logout(token: string) {
    this.db.revokeToken(token);
  }

  listTiffins() {
    return this.db.getTiffins();
  }

  upsertTiffin(tiffin: Partial<TiffinMenuItem>) {
    return this.db.saveTiffin(tiffin);
  }

  deleteTiffin(id: string) {
    this.db.deleteTiffin(id);
    return { success: true };
  }

  getWeeklyMenu() {
    return this.db.getWeeklyMenu();
  }

  setWeeklyMenu(days: WeeklyMenuDay[]) {
    this.db.setWeeklyMenu(days);
    return this.db.getWeeklyMenu();
  }

  getPlans() {
    return this.db.getPlans();
  }

  upsertPlan(plan: Partial<MealPlan>) {
    return this.db.savePlan(plan);
  }

  deletePlan(id: string) {
    this.db.deletePlan(id);
    return { success: true };
  }

  getPromotions() {
    return this.db.getPromotions();
  }

  upsertPromotion(promotion: Partial<Promotion>) {
    return this.db.savePromotion(promotion);
  }

  deletePromotion(id: string) {
    this.db.deletePromotion(id);
    return { success: true };
  }

  updatePaymentSettings(settings: Partial<PaymentSettings>) {
    return this.db.updatePaymentSettings(settings);
  }

  getPaymentSettings() {
    return this.db.getPaymentSettings();
  }

  updateIntegrationSettings(settings: Partial<IntegrationSettings>) {
    return this.db.updateIntegrationSettings(settings);
  }

  getIntegrationSettings() {
    return this.db.getIntegrationSettings();
  }

  listOrders() {
    return this.db.getOrders();
  }

  updateOrder(order: Partial<Order>) {
    return this.db.saveOrder(order);
  }

  listDeliveries() {
    return this.db.getDeliveries();
  }

  updateDelivery(delivery: Partial<Delivery>) {
    return this.db.saveDelivery(delivery);
  }
}
