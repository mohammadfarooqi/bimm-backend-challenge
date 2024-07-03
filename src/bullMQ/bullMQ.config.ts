import { BullModule } from '@nestjs/bullmq';
import { QUEUE_BATCH_JOB, QUEUE_VEHICLE_JOB } from './queue.constants';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const BullMqModule = BullModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    connection: {
      host: configService.get('redis.host'),
      port: configService.get('redis.port'),
    },
  }),
});

export const RegisterQueues = BullModule.registerQueue(
  {
    name: QUEUE_BATCH_JOB,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 3500,
      },
      removeOnComplete: true,
    },
  },
  {
    name: QUEUE_VEHICLE_JOB,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 3500,
      },
      removeOnComplete: true,
    },
  },
);
