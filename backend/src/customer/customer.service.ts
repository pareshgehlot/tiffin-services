import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {
  Address,
  InMemoryDatabase,
  Order,
  PaymentSettings,
  Promotion,
  Review,
  TiffinMenuItem
} from '../common/in-memory.database';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CustomerService {
  constructor(private readonly db: InMemoryDatabase) {}

  createOtp(phone: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    this.db.setOtp(phone, { code, expiresAt });
    return code;
  }

  verifyOtp(phone: string, code: string) {
    const entry = this.db.getOtp(phone);
    if (!entry || entry.code !== code || entry.expiresAt < Date.now()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }
    this.db.clearOtp(phone);
  }

  upsertCustomerProfile(profile: {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
  }) {
    if (profile.id) {
      return this.db.saveCustomer({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        verified: true
      });
    }
    return this.db.saveCustomer({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      verified: !!profile.phone
    });
  }

  addAddress(customerId: string, address: Omit<Address, 'id'>) {
    const customer = this.db.getCustomers().find((item) => item.id === customerId);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const newAddress: Address = { ...address, id: uuid() };
    customer.addresses.push(newAddress);
    this.db.saveCustomer(customer);
    return newAddress;
  }

  placeOrder(order: Partial<Order>) {
    if (!order.tiffinId) {
      throw new NotFoundException('Tiffin is required');
    }
    const deliveryAddress = order.deliveryAddress
      ? { ...order.deliveryAddress, id: uuid() }
      : undefined;
    const created = this.db.saveOrder({ ...order, deliveryAddress });
    if (created.customerId) {
      this.db.addOrderToCustomer(created.customerId, created.id);
    }
    if (order.deliveryAddress) {
      this.db.saveDelivery({
        orderId: created.id,
        status: 'scheduled',
        scheduledFor: new Date().toISOString()
      });
    }
    return created;
  }

  listCustomerOrders(customerId: string) {
    const customer = this.db.getCustomers().find((item) => item.id === customerId);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer.orderHistory
      .map((orderId) => this.db.getOrders().find((order) => order.id === orderId))
      .filter(Boolean);
  }

  getPublicData() {
    return {
      tiffins: this.db.getTiffins(),
      weeklyMenu: this.db.getWeeklyMenu(),
      plans: this.db.getPlans(),
      promotions: this.db.getPromotions(),
      reviews: this.db.getReviews(),
      paymentSettings: this.db.getPaymentSettings()
    };
  }

  listReviews(): Review[] {
    return this.db.getReviews();
  }

  listPromotions(): Promotion[] {
    return this.db.getPromotions();
  }

  listTiffins(): TiffinMenuItem[] {
    return this.db.getTiffins();
  }

  getPaymentSettings(): PaymentSettings {
    return this.db.getPaymentSettings();
  }
}
