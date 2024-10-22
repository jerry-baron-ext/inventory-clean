// logger/logger.service.ts
import { Injectable } from '@nestjs/common';
import { CloudWatchService } from '../aws/cloudwatch.service';

@Injectable()
export class LoggerService {
  constructor(private readonly cloudWatchService: CloudWatchService) {}

  async log(message: string) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
    await this.cloudWatchService.log(message, 'INFO');
  }

  async error(message: string, error?: Error) {
    const errorMessage = error ? `${message}: ${error.message}` : message;
    console.error(`[ERROR] ${new Date().toISOString()} - ${errorMessage}`);
    await this.cloudWatchService.log(errorMessage, 'ERROR');
    
    if (error && error.stack) {
      console.error(error.stack);
      await this.cloudWatchService.log(`Stack trace: ${error.stack}`, 'ERROR');
    }
  }
}