import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

export type UserRole = 'admin' | 'customer' | 'driver';

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
  userId?: string;
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
  driverId?: string;
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

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email?: string;
  phone?: string;
  password: string;
  verified: boolean;
  createdAt: string;
}

interface SessionToken {
  token: string;
  userId: string;
  role: UserRole;
  createdAt: number;
}

interface DataState {
  users: User[];
  sessions: SessionToken[];
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

const defaultAdminId = uuid();
const veggieTiffinId = uuid();
const proteinTiffinId = uuid();
const comfortTiffinId = uuid();

const sampleTiffins: TiffinMenuItem[] = [
  {
    id: veggieTiffinId,
    name: 'Garden Fresh Tiffin',
    description: 'Seasonal vegetarian spread with millet rotis and dal.',
    price: 14.99,
    imageUrl: 'https://images.unsplash.com/photo-1604908177894-431f6736f1c4?auto=format&fit=crop&w=800&q=80',
    itemsIncluded: ['Millet Rotis', 'Sprouted Lentil Dal', 'Roasted Cauliflower', 'Kachumber Salad']
  },
  {
    id: proteinTiffinId,
    name: 'Protein Power Lunch',
    description: 'High-protein bowl with quinoa, paneer tikka, and fresh greens.',
    price: 17.49,
    imageUrl: 'https://images.unsplash.com/photo-1604908177522-4027ebcb0c75?auto=format&fit=crop&w=800&q=80',
    itemsIncluded: ['Herbed Quinoa', 'Paneer Tikka', 'Coconut Chutney', 'Spiced Chickpeas']
  },
  {
    id: comfortTiffinId,
    name: 'Comfort Classics',
    description: 'Weekend-ready comfort platter with homestyle curries.',
    price: 15.5,
    imageUrl: 'https://images.unsplash.com/photo-1612874470982-56e5f13d2180?auto=format&fit=crop&w=800&q=80',
    itemsIncluded: ['Jeera Rice', 'Butter Paneer', 'Garlic Naan', 'Gulab Jamun']
  }
];

const samplePlans: MealPlan[] = [
  {
    id: uuid(),
    name: 'Daily Delight',
    billingCycle: 'daily',
    price: 16.99,
    description: 'Perfect for spontaneous cravings with same-day delivery.',
    perks: ['Flexible delivery window', 'Choose from 3 chef specials daily', 'Cancel anytime']
  },
  {
    id: uuid(),
    name: 'Weekly Wellness',
    billingCycle: 'weekly',
    price: 89.99,
    description: 'Balanced meals curated by in-house nutritionists.',
    perks: ['Free mid-week dessert', 'Nutritionist tips newsletter', 'Priority delivery slots']
  },
  {
    id: uuid(),
    name: 'Monthly Moments',
    billingCycle: 'monthly',
    price: 329.99,
    description: 'Great for families or dedicated meal planners.',
    perks: ['Complimentary tasting kit', 'Pause up to 4 deliveries', 'Dedicated concierge support']
  }
];

const samplePromotions: Promotion[] = [
  {
    id: uuid(),
    title: 'Spring Spice Festival',
    description: 'Celebrate the season with curated spice routes and 15% off signature meals.',
    discountPercent: 15,
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    active: true
  },
  {
    id: uuid(),
    title: 'Refer a Foodie',
    description: 'Invite friends and both of you get $10 credits for the next tiffin.',
    discountPercent: 10,
    active: true
  }
];

const sampleReviews: Review[] = [
  {
    id: uuid(),
    author: 'Sonia P.',
    rating: 5,
    comment: 'The menus are so thoughtfully crafted—my family looks forward to every delivery!',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'google'
  },
  {
    id: uuid(),
    author: 'Marcus L.',
    rating: 4,
    comment: 'Delivery drivers are prompt and the Interac instructions were super easy.',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'in-app'
  }
];

const sampleWeeklyMenu: WeeklyMenuDay[] = [
  { day: 'monday', tiffinId: veggieTiffinId },
  { day: 'tuesday', tiffinId: proteinTiffinId },
  { day: 'wednesday', tiffinId: comfortTiffinId },
  { day: 'thursday', tiffinId: veggieTiffinId },
  { day: 'friday', tiffinId: proteinTiffinId }
];

@Injectable()
export class InMemoryDatabase {
  private readonly state: DataState = {
    users: [
      {
        id: defaultAdminId,
        role: 'admin',
        name: 'Launch Admin',
        email: 'gehlot.paresh2@gmail.com',
        phone: undefined,
        password: '@Cathas9lives',
        verified: true,
        createdAt: new Date().toISOString()
      }
    ],
    sessions: [],
    tiffins: [...sampleTiffins],
    weeklyMenu: [...sampleWeeklyMenu],
    plans: [...samplePlans],
    promotions: [...samplePromotions],
    orders: [],
    deliveries: [],
    customers: [],
    reviews: [...sampleReviews],
    otps: {},
    paymentSettings: {
      allowCashOnDelivery: true,
      allowCreditCard: true,
      allowInterac: true,
      creditCardProcessor: 'Stripe',
      processorPublicKey: '',
      processorSecretKey: '',
      interacRecipientEmail: '',
      notes: 'Configure payment processors, Interac recipient details, and merchant keys here.'
    },
    integrationSettings: {
      googleBusinessProfileUrl: '',
      googlePlaceId: '',
      enableReviewSync: false
    }
  };

  /* User management */

  listUsers(role?: UserRole): User[] {
    return role ? this.state.users.filter((user) => user.role === role) : [...this.state.users];
  }

  findUserById(id: string): User | undefined {
    return this.state.users.find((user) => user.id === id);
  }

  findUserByEmail(email: string): User | undefined {
    return this.state.users.find((user) => user.email && user.email.toLowerCase() === email.toLowerCase());
  }

  findUserByPhone(phone: string): User | undefined {
    return this.state.users.find((user) => user.phone && user.phone === phone);
  }

  saveUser(user: Partial<User> & { role: UserRole }): User {
    if (user.id) {
      const existing = this.findUserById(user.id);
      if (existing) {
        Object.assign(existing, {
          name: user.name ?? existing.name,
          email: user.email ?? existing.email,
          phone: user.phone ?? existing.phone,
          password: user.password ?? existing.password,
          verified: user.verified ?? existing.verified,
          role: user.role ?? existing.role
        });
        return existing;
      }
    }

    const created: User = {
      id: user.id ?? uuid(),
      role: user.role,
      name: user.name ?? 'Team Member',
      email: user.email,
      phone: user.phone,
      password: user.password ?? uuid().slice(0, 8),
      verified: user.verified ?? false,
      createdAt: new Date().toISOString()
    };
    this.state.users.push(created);
    return created;
  }

  deleteUser(id: string): User | undefined {
    const user = this.findUserById(id);
    if (!user) {
      return undefined;
    }
    this.state.users = this.state.users.filter((item) => item.id !== id);
    this.state.sessions = this.state.sessions.filter((session) => session.userId !== id);

    if (user.role === 'customer') {
      this.state.customers = this.state.customers.filter(
        (customer) => customer.userId !== id && customer.id !== id
      );
      this.state.orders.forEach((order) => {
        if (order.customerId === id) {
          order.customerId = undefined;
        }
      });
    }

    if (user.role === 'driver') {
      this.state.deliveries = this.state.deliveries.map((delivery) =>
        delivery.driverId === id ? { ...delivery, driverId: undefined } : delivery
      );
    }

    return user;
  }

  createSession(userId: string, role: UserRole): SessionToken {
    const token: SessionToken = {
      token: uuid(),
      userId,
      role,
      createdAt: Date.now()
    };
    this.state.sessions.push(token);
    return token;
  }

  getSession(token: string, role?: UserRole): SessionToken | undefined {
    const session = this.state.sessions.find((item) => item.token === token);
    if (!session) {
      return undefined;
    }
    if (role && session.role !== role) {
      return undefined;
    }
    return session;
  }

  getUserByToken(token: string, role?: UserRole): User | undefined {
    const session = this.getSession(token, role);
    if (!session) {
      return undefined;
    }
    return this.findUserById(session.userId);
  }

  revokeSession(token: string) {
    this.state.sessions = this.state.sessions.filter((session) => session.token !== token);
  }

  revokeSessionsForUser(userId: string) {
    this.state.sessions = this.state.sessions.filter((session) => session.userId !== userId);
  }

  /* Tiffins & menus */

  getTiffins() {
    return this.state.tiffins;
  }

  saveTiffin(tiffin: Partial<TiffinMenuItem>) {
    if (tiffin.id) {
      const existing = this.state.tiffins.find((item) => item.id === tiffin.id);
      if (existing) {
        Object.assign(existing, tiffin);
        return existing;
      }
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

  /* Plans */

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
    this.state.plans = this.state.plans.filter((item) => item.id !== id);
  }

  /* Promotions */

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
      title: promotion.title ?? 'Untitled Promotion',
      description: promotion.description ?? '',
      discountPercent: promotion.discountPercent ?? 0,
      validUntil: promotion.validUntil,
      active: promotion.active ?? true
    };
    this.state.promotions.push(created);
    return created;
  }

  deletePromotion(id: string) {
    this.state.promotions = this.state.promotions.filter((item) => item.id !== id);
  }

  /* Orders & deliveries */

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
      customerId: order.customerId,
      guestEmail: order.guestEmail,
      guestPhone: order.guestPhone,
      status: order.status ?? 'pending',
      tiffinId: order.tiffinId!,
      planId: order.planId,
      paymentMethod: order.paymentMethod ?? 'cash',
      total: order.total ?? 0,
      deliveryAddress: order.deliveryAddress,
      createdAt: order.createdAt ?? new Date().toISOString()
    };
    this.state.orders.push(created);
    return created;
  }

  addOrderToCustomer(customerId: string, orderId: string) {
    const customer = this.state.customers.find((item) => item.id === customerId);
    if (customer && !customer.orderHistory.includes(orderId)) {
      customer.orderHistory.push(orderId);
    }
  }

  listOrdersForCustomer(customerId: string) {
    return this.state.orders.filter((order) => order.customerId === customerId);
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
      deliveredAt: delivery.deliveredAt,
      driverId: delivery.driverId
    };
    this.state.deliveries.push(created);
    return created;
  }

  getDeliveries() {
    return this.state.deliveries;
  }

  listDeliveriesForDriver(driverId: string) {
    return this.state.deliveries.filter((delivery) => delivery.driverId === driverId);
  }

  /* Customers */

  getCustomers() {
    return this.state.customers;
  }

  getCustomerByUserId(userId: string) {
    return this.state.customers.find((customer) => customer.userId === userId || customer.id === userId);
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
      id: profile.id ?? uuid(),
      userId: profile.userId,
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

  deleteCustomerProfile(id: string) {
    this.state.customers = this.state.customers.filter((customer) => customer.id !== id);
  }

  /* Reviews */

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

  /* Settings */

  getPaymentSettings() {
    return this.state.paymentSettings;
  }

  updatePaymentSettings(settings: Partial<PaymentSettings>) {
    Object.assign(this.state.paymentSettings, settings);
    return this.state.paymentSettings;
  }

  getIntegrationSettings() {
    return this.state.integrationSettings;
  }

  updateIntegrationSettings(settings: Partial<IntegrationSettings>) {
    Object.assign(this.state.integrationSettings, settings);
    return this.state.integrationSettings;
  }

  /* OTP */

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
