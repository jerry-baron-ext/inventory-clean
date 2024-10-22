import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { LoggerService } from '../logger/logger.service';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [InventoryController],
  providers: [InventoryService, LoggerService],
})
export class InventoryModule {}