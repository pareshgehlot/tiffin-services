import { Body, Controller, Get, Post, Req, UnauthorizedException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { SignUpDto } from './dto/signup.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AddressDto } from './dto/address.dto';
import { PlaceOrderDto } from './dto/order.dto';
import { CustomerLoginDto } from './dto/login.dto';
import { Request } from 'express';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    const { profile, otp } = this.customerService.upsertCustomerProfile(dto);
    return { profile, otpSent: !!otp };
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    this.customerService.verifyOtp(dto.phone, dto.code);
    return { success: true };
  }

  @Post('login')
  login(@Body() dto: CustomerLoginDto) {
    const response = this.customerService.loginWithPassword(dto.email, dto.phone, dto.password);
    return response;
  }

  @Get('me')
  me(@Req() req: Request) {
    const token = req.headers['x-auth-token'];
    if (typeof token !== 'string') {
      throw new UnauthorizedException('Missing session token');
    }
    return this.customerService.getProfileForToken(token);
  }

  @Get('me/orders')
  myOrders(@Req() req: Request) {
    const token = req.headers['x-auth-token'];
    if (typeof token !== 'string') {
      throw new UnauthorizedException('Missing session token');
    }
    return this.customerService.listOrdersForToken(token);
  }

  @Post('me/address')
  addAddress(@Req() req: Request, @Body() dto: AddressDto) {
    const token = req.headers['x-auth-token'];
    if (typeof token !== 'string') {
      throw new UnauthorizedException('Missing session token');
    }
    return this.customerService.addAddressForToken(token, dto);
  }

  @Post('order')
  placeOrder(@Req() req: Request, @Body() dto: PlaceOrderDto) {
    const token = req.headers['x-auth-token'];
    return this.customerService.placeOrder(dto, typeof token === 'string' ? token : undefined);
  }

  @Get('public/data')
  getPublicData() {
    return this.customerService.getPublicData();
  }
}
