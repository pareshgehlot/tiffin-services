import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {
  Delivery,
  InMemoryDatabase,
  IntegrationSettings,
  MealPlan,
  Order,
  PaymentSettings,
  Promotion,
  TiffinMenuItem,
  User,
  UserRole,
  WeeklyMenuDay
} from '../common/in-memory.database';

@Injectable()
export class AdminService {
  constructor(private readonly db: InMemoryDatabase) {}

  login(identifier: string, password: string) {
    const user = this.db
      .listUsers('admin')
      .find((item) =>
        item.email
          ? item.email.toLowerCase() === identifier.toLowerCase()
          : item.phone === identifier
      );

    if (user && user.password === password) {
      const session = this.db.createSession(user.id, 'admin');
      return { token: session.token, profile: { id: user.id, name: user.name, email: user.email } };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  validateToken(token: string) {
    const sessionUser = this.db.getUserByToken(token, 'admin');
    if (!sessionUser) {
      throw new UnauthorizedException('Invalid or expired session token');
    }
    return sessionUser;
  }

  logout(token: string) {
    this.db.revokeSession(token);
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
    const updated = this.db.saveOrder(order);
    if (updated.customerId) {
      this.db.addOrderToCustomer(updated.customerId, updated.id);
    }
    return updated;
  }

  listDeliveries() {
    return this.db.getDeliveries();
  }

  updateDelivery(delivery: Partial<Delivery>) {
    return this.db.saveDelivery(delivery);
  }

  listUsers(role?: UserRole): User[] {
    return this.db.listUsers(role);
  }

  createUser(user: Partial<User>) {
    if (!user.role) {
      throw new BadRequestException('Role is required');
    }
    if (!user.password) {
      user.password = Math.random().toString(36).slice(2, 10);
    }
    const created = this.db.saveUser(user as User);

    if (created.role === 'customer') {
      const existingProfile = this.db.getCustomerByUserId(created.id);
      if (!existingProfile) {
        this.db.saveCustomer({
          id: created.id,
          userId: created.id,
          name: created.name,
          email: created.email,
          phone: created.phone,
          verified: created.verified
        });
      }
    }

    return created;
  }

  updateUser(id: string, updates: Partial<User>) {
    const existing = this.db.findUserById(id);
    if (!existing) {
      throw new NotFoundException('User not found');
    }
    const updated = this.db.saveUser({ ...existing, ...updates });

    if (updated.role === 'customer') {
      const profile = this.db.getCustomerByUserId(updated.id);
      if (profile) {
        this.db.saveCustomer({
          id: profile.id,
          userId: updated.id,
          name: updates.name ?? profile.name,
          email: updates.email ?? profile.email,
          phone: updates.phone ?? profile.phone,
          verified: updates.verified ?? profile.verified
        });
      }
    }

    if (updates.password) {
      this.db.revokeSessionsForUser(updated.id);
    }

    return updated;
  }

  deleteUser(id: string) {
    const removed = this.db.deleteUser(id);
    if (!removed) {
      throw new NotFoundException('User not found');
    }
    return removed;
  }
}
