import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Delivery, InMemoryDatabase, Order, User } from '../common/in-memory.database';

@Injectable()
export class DriverService {
  constructor(private readonly db: InMemoryDatabase) {}

  private resolveDriver(identifier: string): User | undefined {
    return this.db
      .listUsers('driver')
      .find((driver) =>
        driver.email
          ? driver.email.toLowerCase() === identifier.toLowerCase()
          : driver.phone === identifier
      );
  }

  login(identifier: string, password: string) {
    const driver = this.resolveDriver(identifier);
    if (!driver || driver.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const session = this.db.createSession(driver.id, 'driver');
    return {
      token: session.token,
      profile: {
        id: driver.id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone
      }
    };
  }

  private requireDriver(token: string): User {
    const driver = this.db.getUserByToken(token, 'driver');
    if (!driver) {
      throw new UnauthorizedException('Invalid session');
    }
    return driver;
  }

  listAssignments(token: string) {
    const driver = this.requireDriver(token);
    const deliveries = this.db.listDeliveriesForDriver(driver.id);
    const orders = deliveries
      .map((delivery) => this.db.getOrders().find((order) => order.id === delivery.orderId))
      .filter(Boolean) as Order[];
    return {
      driver: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone
      },
      deliveries,
      orders
    };
  }

  updateDeliveryStatus(token: string, payload: { id: string; status: Delivery['status']; deliveredAt?: string }) {
    const driver = this.requireDriver(token);
    const delivery = this.db.getDeliveries().find((item) => item.id === payload.id);
    if (!delivery || delivery.driverId !== driver.id) {
      throw new NotFoundException('Delivery not found for driver');
    }
    return this.db.saveDelivery({
      id: payload.id,
      status: payload.status,
      deliveredAt: payload.deliveredAt ?? (payload.status === 'delivered' ? new Date().toISOString() : delivery.deliveredAt)
    });
  }
}
