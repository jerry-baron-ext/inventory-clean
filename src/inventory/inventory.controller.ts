// inventory/inventory.controller.ts
import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { LoggerService } from '../logger/logger.service';

@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get('stock/:productId')
  async getStock(@Param('productId') productId: string) {
    this.loggerService.log(`Checking stock for product ${productId}`);
    return this.inventoryService.getStock(productId);
  }

  @Post('receive')
  async receiveProduct(@Body() receiveDto: { productId: string; quantity: number }) {
    this.loggerService.log(`Receiving ${receiveDto.quantity} units of product ${receiveDto.productId}`);
    return this.inventoryService.receiveProduct(receiveDto.productId, receiveDto.quantity);
  }

  @Post('ship')
  async shipProduct(@Body() shipDto: { productId: string; quantity: number }) {
    this.loggerService.log(`Shipping ${shipDto.quantity} units of product ${shipDto.productId}`);
    return this.inventoryService.shipProduct(shipDto.productId, shipDto.quantity);
  }

  @Get('error')
  async triggerError() {
    this.loggerService.error('Simulated 500 Internal Server Error');
    throw new HttpException('Simulated server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}