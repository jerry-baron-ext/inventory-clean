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
    try {
      await this.loggerService.log(`Checking stock for product ${productId}`);
      return await this.inventoryService.getStock(productId);
    } catch (error) {
      await this.loggerService.error(`Error checking stock for product ${productId}`, error);
      throw new HttpException('Error checking stock', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('receive')
  async receiveProduct(@Body() receiveDto: { productId: string; quantity: number }) {
    try {
      await this.loggerService.log(`Receiving ${receiveDto.quantity} units of product ${receiveDto.productId}`);
      return await this.inventoryService.receiveProduct(receiveDto.productId, receiveDto.quantity);
    } catch (error) {
      await this.loggerService.error(`Error receiving product ${receiveDto.productId}`, error);
      throw new HttpException('Error receiving product', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('ship')
  async shipProduct(@Body() shipDto: { productId: string; quantity: number }) {
    try {
      await this.loggerService.log(`Shipping ${shipDto.quantity} units of product ${shipDto.productId}`);
      return await this.inventoryService.shipProduct(shipDto.productId, shipDto.quantity);
    } catch (error) {
      await this.loggerService.error(`Error shipping product ${shipDto.productId}`, error);
      throw new HttpException('Error shipping product', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('error')
  async triggerError() {
    const error = new Error('Simulated 500 Internal Server Error');
    await this.loggerService.error('Simulated 500 Internal Server Error', error);
    throw new HttpException('Simulated server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}