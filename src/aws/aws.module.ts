import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudWatchService } from './cloudwatch.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: CloudWatchService,
      useFactory: (configService: ConfigService) => {
        const awsConfig = configService.get('aws');
        return new CloudWatchService(awsConfig);
      },
      inject: [ConfigService],
    },
  ],
  exports: [CloudWatchService],
})
export class AwsModule {}