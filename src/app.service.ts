import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { QueueService } from './bullMQ/queue.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private queueService: QueueService) {}

  onApplicationBootstrap() {
    console.log('AppService has been bootstraped.');
    this.queueService.addBatchJob();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
