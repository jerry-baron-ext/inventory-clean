import { Injectable } from '@nestjs/common';
import {
  CloudWatchLogsClient,
  PutLogEventsCommand,
  CreateLogStreamCommand,
  CreateLogGroupCommand,
  DescribeLogStreamsCommand,
} from '@aws-sdk/client-cloudwatch-logs';

@Injectable()
export class CloudWatchService {
  private client: CloudWatchLogsClient;
  private logGroupName: string;
  private logStreamName: string;

  constructor(awsConfig: { accessKeyId: string; secretAccessKey: string; region: string }) {
    this.client = new CloudWatchLogsClient({
      credentials: {  
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
      region: awsConfig.region,
    });
    this.logGroupName = '/inventory-clean-2/logs-prod';
    this.logStreamName = `${new Date().toISOString().split('T')[0]}-stream`;
    this.createLogGroupAndStream();
  }

  private async createLogGroupAndStream() {
    try {
      await this.client.send(new CreateLogGroupCommand({ logGroupName: this.logGroupName }));
      console.log(`Log group created: ${this.logGroupName}`);
    } catch (error) {
      if (error.name !== 'ResourceAlreadyExistsException') {
        console.error('Failed to create log group:', error);
      }
    }

    try {
      // Crear el flujo de logs si no existe
      const describeParams = { logGroupName: this.logGroupName };
      const { logStreams } = await this.client.send(new DescribeLogStreamsCommand(describeParams));

      const logStreamExists = logStreams?.some(stream => stream.logStreamName === this.logStreamName);
      if (!logStreamExists) {
        await this.client.send(new CreateLogStreamCommand({
          logGroupName: this.logGroupName,
          logStreamName: this.logStreamName,
        }));
        console.log(`Log stream created: ${this.logStreamName}`);
      }
    } catch (error) {
      console.error('Failed to create log stream:', error);
    }
  }

  async log(message: string, logLevel: string): Promise<void> {
    const params = {
      logGroupName: this.logGroupName,
      logStreamName: this.logStreamName,
      logEvents: [
        {
          message: `[${logLevel}] ${message}`,
          timestamp: Date.now(),
        },
      ],
    };

    try {
      await this.client.send(new PutLogEventsCommand(params));
      console.log(`Log sent: [${logLevel}] ${message}`);
    } catch (error) {
      console.error('Failed to send logs to CloudWatch:', error);
    }
  }
}
