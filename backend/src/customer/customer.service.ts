import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {
  Address,
  CustomerProfile,
  InMemoryDatabase,
  Order,
  PaymentSettings,
  Promotion,
  Review,
  TiffinMenuItem,
  User
} from '../common/in-memory.database';
import { v4 as uuid } from 'uuid';

interface SignUpPayload {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
}

@Injectable()
export class CustomerService {
  constructor(private readonly db: InMemoryDatabase) {}

  private resolveExistingCustomer(email?: string, phone?: string) {
    if (email) {
      const user = this.db.findUserByEmail(email);
      if (user) {
        return user;
      }
    }
    if (phone) {
      const user = this.db.findUserByPhone(phone);
      if (user) {
        return user;
      }
    }
    return undefined;
  }

  private ensureCustomerProfile(user: User) {
    let profile = this.db.getCustomerByUserId(user.id);
    if (!profile) {
      profile = this.db.saveCustomer({
        id: user.id,
        userId: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        verified: user.verified,
        addresses: [],
        orderHistory: []
      });
    }
    return profile;
  }

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
    const user = this.db.findUserByPhone(phone);
    if (user) {
      this.db.saveUser({ ...user, verified: true });
      this.db.saveCustomer({
        id: user.id,
        userId: user.id,
        verified: true
      });
    }
  }

  upsertCustomerProfile(profile: SignUpPayload) {
    const existingUser = this.resolveExistingCustomer(profile.email, profile.phone);
    const baseUser: Partial<User> = existingUser
      ? { ...existingUser }
      : {
          role: 'customer',
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          password: profile.password || Math.random().toString(36).slice(2, 10),
          verified: !!profile.phone
        };

    if (existingUser) {
      baseUser.name = profile.name ?? existingUser.name;
      baseUser.email = profile.email ?? existingUser.email;
      baseUser.phone = profile.phone ?? existingUser.phone;
      baseUser.password = profile.password ?? existingUser.password;
    }

    const savedUser = this.db.saveUser({
      id: baseUser.id,
      role: 'customer',
      name: baseUser.name ?? profile.name,
      email: baseUser.email ?? profile.email,
      phone: baseUser.phone ?? profile.phone,
      password: baseUser.password!,
      verified: baseUser.verified ?? false,
      createdAt: existingUser?.createdAt ?? new Date().toISOString()
    });

    const savedProfile = this.db.saveCustomer({
      id: savedUser.id,
      userId: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      phone: savedUser.phone,
      verified: savedUser.verified
    });

    let otp: string | undefined;
    if (profile.phone) {
      otp = this.createOtp(profile.phone);
    }

    return { user: savedUser, profile: savedProfile, otp };
  }

  loginWithPassword(email: string | undefined, phone: string | undefined, password: string) {
    let user: User | undefined;
    if (email) {
      user = this.db.findUserByEmail(email);
    }
    if (!user && phone) {
      user = this.db.findUserByPhone(phone);
    }
    if (!user || user.role !== 'customer' || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const session = this.db.createSession(user.id, 'customer');
    const profile = this.ensureCustomerProfile(user);
    return { token: session.token, profile };
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

  addAddressForToken(token: string, address: Omit<Address, 'id'>) {
    const user = this.db.getUserByToken(token, 'customer');
    if (!user) {
      throw new UnauthorizedException('Invalid session');
    }
    const profile = this.ensureCustomerProfile(user);
    return this.addAddress(profile.id, address);
  }

  placeOrder(order: Partial<Order>, token?: string) {
    if (!order.tiffinId) {
      throw new NotFoundException('Tiffin is required');
    }
    if (token) {
      const user = this.db.getUserByToken(token, 'customer');
      if (user) {
        order.customerId = user.id;
      }
    }
    const deliveryAddress = order.deliveryAddress ? { ...order.deliveryAddress, id: uuid() } : undefined;
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
    return this.db.listOrdersForCustomer(customer.id);
  }

  listOrdersForToken(token: string) {
    const user = this.db.getUserByToken(token, 'customer');
    if (!user) {
      throw new UnauthorizedException('Invalid session');
    }
    return this.db.listOrdersForCustomer(user.id);
  }

  getProfileForToken(token: string): CustomerProfile {
    const user = this.db.getUserByToken(token, 'customer');
    if (!user) {
      throw new UnauthorizedException('Invalid session');
    }
    return this.ensureCustomerProfile(user);
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
