import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { SignUpDto } from './dto/signup.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AddressDto } from './dto/address.dto';
import { PlaceOrderDto } from './dto/order.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    const profile = this.customerService.upsertCustomerProfile(dto);
    let otp: string | undefined;
    if (dto.phone) {
      otp = this.customerService.createOtp(dto.phone);
    }
    return { profile, otpSent: !!otp };
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    this.customerService.verifyOtp(dto.phone, dto.code);
    return { success: true };
  }

  @Post(':id/address')
  addAddress(@Param('id') id: string, @Body() dto: AddressDto) {
    return this.customerService.addAddress(id, dto);
  }

  @Post('order')
  placeOrder(@Body() dto: PlaceOrderDto) {
    return this.customerService.placeOrder(dto);
  }

  @Get(':id/orders')
  listOrders(@Param('id') id: string) {
    return this.customerService.listCustomerOrders(id);
  }

  @Get('public/data')
  getPublicData() {
    return this.customerService.getPublicData();
  }
}
