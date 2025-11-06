import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './customer/customer.module';
import { PublicModule } from './common/public.module';

@Module({
  imports: [AdminModule, CustomerModule, PublicModule]
})
export class AppModule {}
