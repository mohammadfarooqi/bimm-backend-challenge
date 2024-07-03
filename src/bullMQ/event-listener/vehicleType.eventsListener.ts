import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { QUEUE_VEHICLE_JOB } from '../queue.constants';

@QueueEventsListener(QUEUE_VEHICLE_JOB)
export class MakeEventListner extends QueueEventsHost {
  @OnQueueEvent('active')
  onActive(
    args: {
      jobId: string;
      prev?: string;
    },
    id: string,
  ) {
    // eslint-disable-next-line prettier/prettier
    console.log(`Active event on ${QUEUE_VEHICLE_JOB} with id: ${id} and args: ${JSON.stringify(args)}`);
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
    console.log(`Completed event on ${QUEUE_VEHICLE_JOB} with id: ${id} and args: ${JSON.stringify(args)}`);
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
    console.log(`Failed event on ${QUEUE_VEHICLE_JOB} with id: ${id} and args: ${JSON.stringify(args)}`);
  }

  // Create code for drained
  @OnQueueEvent('drained')
  onDrained() {
    // eslint-disable-next-line prettier/prettier
    console.log(`\nx=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x\n\n ==> COMPLETED all Jobs from the queue '${QUEUE_VEHICLE_JOB}'\n\nx=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x=x\n`);
  }
}
