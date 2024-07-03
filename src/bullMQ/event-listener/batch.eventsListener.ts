import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { QUEUE_BATCH_JOB } from '../queue.constants';

@QueueEventsListener(QUEUE_BATCH_JOB)
export class BatchEventListner extends QueueEventsHost {
  @OnQueueEvent('active')
  onActive(
    args: {
      jobId: string;
      prev?: string;
    },
    id: string,
  ) {
    // eslint-disable-next-line prettier/prettier
    console.log(`Active event on ${QUEUE_BATCH_JOB} with id: ${id} and args: ${JSON.stringify(args)}`);
  }

  @OnQueueEvent('completed')
  onCompleted(
    args: {
      jobId: string;
      returnvalue: string;
      prev?: string;
    },
    id: string,
  ) {
    // eslint-disable-next-line prettier/prettier
    console.log(`Completed event on ${QUEUE_BATCH_JOB} with id: ${id} and args: ${JSON.stringify(args)}`);
  }

  @OnQueueEvent('failed')
  onFailed(
    args: {
      jobId: string;
      failedReason: string;
      prev?: string;
    },
    id: string,
  ) {
    // eslint-disable-next-line prettier/prettier
    console.log(`Failed event on ${QUEUE_BATCH_JOB} with id: ${id} and args: ${JSON.stringify(args)}`);
  }

  // Create code for drained
  @OnQueueEvent('drained')
  onDrained(id: string) {
    console.log(`Drained event on ${QUEUE_BATCH_JOB} with id: ${id}`);
  }
}
