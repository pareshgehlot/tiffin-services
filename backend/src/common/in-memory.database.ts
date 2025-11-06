import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  instructions?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  verified: boolean;
  addresses: Address[];
  orderHistory: string[];
}

export interface TiffinMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  itemsIncluded: string[];
}

export interface WeeklyMenuDay {
  day: string;
  tiffinId: string;
}

export interface MealPlan {
  id: string;
  name: string;
  billingCycle: 'daily' | 'weekly' | 'monthly';
  price: number;
  description: string;
  perks: string[];
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  validUntil?: string;
  active: boolean;
}

export interface Order {
  id: string;
  customerId?: string;
  guestEmail?: string;
  guestPhone?: string;
  status: 'pending' | 'preparing' | 'ready' | 'out-for-delivery' | 'completed' | 'cancelled';
  tiffinId: string;
  planId?: string;
  paymentMethod: 'cash' | 'credit-card' | 'interac';
  total: number;
  deliveryAddress?: Address;
  createdAt: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  status: 'scheduled' | 'enroute' | 'delivered';
  scheduledFor: string;
  deliveredAt?: string;
}

export interface PaymentSettings {
  allowCashOnDelivery: boolean;
  allowCreditCard: boolean;
  allowInterac: boolean;
  creditCardProcessor?: string;
  processorPublicKey?: string;
  processorSecretKey?: string;
  interacRecipientEmail?: string;
  notes?: string;
}

export interface IntegrationSettings {
  googleBusinessProfileUrl?: string;
  googlePlaceId?: string;
  enableReviewSync: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
  source: 'google' | 'in-app';
}

export interface OtpEntry {
  code: string;
  expiresAt: number;
}

interface DataState {
  admin: {
    email: string;
    password: string;
    activeTokens: string[];
  };
  tiffins: TiffinMenuItem[];
  weeklyMenu: WeeklyMenuDay[];
  plans: MealPlan[];
  promotions: Promotion[];
  orders: Order[];
  deliveries: Delivery[];
  customers: CustomerProfile[];
  reviews: Review[];
  otps: Record<string, OtpEntry>;
  paymentSettings: PaymentSettings;
  integrationSettings: IntegrationSettings;
}

@Injectable()
export class InMemoryDatabase {
  private readonly state: DataState = {
    admin: {
      email: 'gehlot.paresh2@gmail.com',
      password: '@Cathas9lives',
      activeTokens: []
    },
    tiffins: [],
    weeklyMenu: [],
    plans: [],
    promotions: [],
    orders: [],
    deliveries: [],
    customers: [],
    reviews: [],
    otps: {},
    paymentSettings: {
      allowCashOnDelivery: true,
      allowCreditCard: true,
      allowInterac: true,
      creditCardProcessor: 'Stripe',
      processorPublicKey: '',
      processorSecretKey: '',
      interacRecipientEmail: '',
      notes: 'Configure payment processors from the admin settings panel.'
    },
    integrationSettings: {
      googleBusinessProfileUrl: '',
      googlePlaceId: '',
      enableReviewSync: false
    }
  };

  getAdmin() {
    return this.state.admin;
  }

  addToken(token: string) {
    this.state.admin.activeTokens.push(token);
  }

  revokeToken(token: string) {
    this.state.admin.activeTokens = this.state.admin.activeTokens.filter(
      (activeToken) => activeToken !== token
    );
  }

  isTokenActive(token: string) {
    return this.state.admin.activeTokens.includes(token);
  }

  getTiffins() {
    return this.state.tiffins;
  }

  saveTiffin(tiffin: Partial<TiffinMenuItem>) {
    const existing = this.state.tiffins.find((item) => item.id === tiffin.id);
    if (existing) {
      Object.assign(existing, tiffin);
      return existing;
    }
    const created: TiffinMenuItem = {
      id: uuid(),
      name: tiffin.name ?? 'Untitled Tiffin',
      description: tiffin.description ?? '',
      price: tiffin.price ?? 0,
      imageUrl: tiffin.imageUrl,
      itemsIncluded: tiffin.itemsIncluded ?? []
    };
    this.state.tiffins.push(created);
    return created;
  }

  deleteTiffin(id: string) {
    this.state.tiffins = this.state.tiffins.filter((item) => item.id !== id);
    this.state.weeklyMenu = this.state.weeklyMenu.filter((day) => day.tiffinId !== id);
  }

  getWeeklyMenu() {
    return this.state.weeklyMenu;
  }

  setWeeklyMenu(days: WeeklyMenuDay[]) {
    this.state.weeklyMenu = days;
  }

  getPlans() {
    return this.state.plans;
  }

  savePlan(plan: Partial<MealPlan>) {
    if (plan.id) {
      const existing = this.state.plans.find((item) => item.id === plan.id);
      if (existing) {
        Object.assign(existing, plan);
        return existing;
      }
    }
    const created: MealPlan = {
      id: uuid(),
      name: plan.name ?? 'Custom Plan',
      billingCycle: plan.billingCycle ?? 'monthly',
      price: plan.price ?? 0,
      description: plan.description ?? '',
      perks: plan.perks ?? []
    };
    this.state.plans.push(created);
    return created;
  }

  deletePlan(id: string) {
    this.state.plans = this.state.plans.filter((plan) => plan.id !== id);
  }

  getPromotions() {
    return this.state.promotions;
  }

  savePromotion(promotion: Partial<Promotion>) {
    if (promotion.id) {
      const existing = this.state.promotions.find((item) => item.id === promotion.id);
      if (existing) {
        Object.assign(existing, promotion);
        return existing;
      }
    }
    const created: Promotion = {
      id: uuid(),
      title: promotion.title ?? 'New Promotion',
      description: promotion.description ?? '',
      discountPercent: promotion.discountPercent ?? 0,
      validUntil: promotion.validUntil,
      active: promotion.active ?? true
    };
    this.state.promotions.push(created);
    return created;
  }

  deletePromotion(id: string) {
    this.state.promotions = this.state.promotions.filter((promotion) => promotion.id !== id);
  }

  getPaymentSettings() {
    return this.state.paymentSettings;
  }

  updatePaymentSettings(settings: Partial<PaymentSettings>) {
    this.state.paymentSettings = { ...this.state.paymentSettings, ...settings };
    return this.state.paymentSettings;
  }

  getIntegrationSettings() {
    return this.state.integrationSettings;
  }

  updateIntegrationSettings(settings: Partial<IntegrationSettings>) {
    this.state.integrationSettings = { ...this.state.integrationSettings, ...settings };
    return this.state.integrationSettings;
  }

  getOrders() {
    return this.state.orders;
  }

  saveOrder(order: Partial<Order>) {
    if (order.id) {
      const existing = this.state.orders.find((item) => item.id === order.id);
      if (existing) {
        Object.assign(existing, order);
        return existing;
      }
    }
    const created: Order = {
      id: uuid(),
      status: order.status ?? 'pending',
      tiffinId: order.tiffinId!,
      planId: order.planId,
      customerId: order.customerId,
      guestEmail: order.guestEmail,
      guestPhone: order.guestPhone,
      paymentMethod: order.paymentMethod ?? 'cash',
      total: order.total ?? 0,
      deliveryAddress: order.deliveryAddress,
      createdAt: new Date().toISOString()
    };
    this.state.orders.push(created);
    return created;
  }

  saveDelivery(delivery: Partial<Delivery>) {
    if (delivery.id) {
      const existing = this.state.deliveries.find((item) => item.id === delivery.id);
      if (existing) {
        Object.assign(existing, delivery);
        return existing;
      }
    }
    const created: Delivery = {
      id: uuid(),
      orderId: delivery.orderId!,
      status: delivery.status ?? 'scheduled',
      scheduledFor: delivery.scheduledFor ?? new Date().toISOString(),
      deliveredAt: delivery.deliveredAt
    };
    this.state.deliveries.push(created);
    return created;
  }

  getDeliveries() {
    return this.state.deliveries;
  }

  getCustomers() {
    return this.state.customers;
  }

  saveCustomer(profile: Partial<CustomerProfile>) {
    if (profile.id) {
      const existing = this.state.customers.find((item) => item.id === profile.id);
      if (existing) {
        Object.assign(existing, profile);
        return existing;
      }
    }
    const created: CustomerProfile = {
      id: uuid(),
      name: profile.name ?? 'Guest',
      email: profile.email,
      phone: profile.phone,
      verified: profile.verified ?? false,
      addresses: profile.addresses ?? [],
      orderHistory: profile.orderHistory ?? []
    };
    this.state.customers.push(created);
    return created;
  }

  addOrderToCustomer(customerId: string, orderId: string) {
    const customer = this.state.customers.find((item) => item.id === customerId);
    if (customer) {
      customer.orderHistory.push(orderId);
    }
  }

  getReviews() {
    return this.state.reviews;
  }

  saveReview(review: Partial<Review>) {
    if (review.id) {
      const existing = this.state.reviews.find((item) => item.id === review.id);
      if (existing) {
        Object.assign(existing, review);
        return existing;
      }
    }
    const created: Review = {
      id: uuid(),
      author: review.author ?? 'Anonymous',
      rating: review.rating ?? 5,
      comment: review.comment ?? '',
      createdAt: review.createdAt ?? new Date().toISOString(),
      source: review.source ?? 'in-app'
    };
    this.state.reviews.push(created);
    return created;
  }

  deleteReview(id: string) {
    this.state.reviews = this.state.reviews.filter((review) => review.id !== id);
  }

  setOtp(phone: string, entry: OtpEntry) {
    this.state.otps[phone] = entry;
  }

  getOtp(phone: string) {
    return this.state.otps[phone];
  }

  clearOtp(phone: string) {
    delete this.state.otps[phone];
  }
}
