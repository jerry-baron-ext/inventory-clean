import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InventoryModule } from './inventory/inventory.module';
import { AwsModule } from './aws/aws.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    InventoryModule,
    AwsModule,
  ],
})
export class AppModule {}