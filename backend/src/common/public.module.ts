import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PublicController]
})
export class PublicModule {}
