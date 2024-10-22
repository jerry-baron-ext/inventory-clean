import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class InventoryService {
  private inventory: Map<string, number> = new Map();

  constructor(private readonly loggerService: LoggerService) {}

  async getStock(productId: string): Promise<number> {
    const stock = this.inventory.get(productId) || 0;
    this.loggerService.log(`Current stock for product ${productId}: ${stock}`);
    return stock;
  }

  async receiveProduct(productId: string, quantity: number): Promise<void> {
    const currentStock = this.inventory.get(productId) || 0;
    this.inventory.set(productId, currentStock + quantity);
    this.loggerService.log(`Updated stock for product ${productId}: ${currentStock + quantity}`);
  }

  async shipProduct(productId: string, quantity: number): Promise<void> {
    const currentStock = this.inventory.get(productId) || 0;
    if (currentStock < quantity) {
      this.loggerService.error(`Insufficient stock for product ${productId}`);
      throw new Error('Insufficient stock');
    }
    this.inventory.set(productId, currentStock - quantity);
    this.loggerService.log(`Updated stock for product ${productId}: ${currentStock - quantity}`);
  }
}