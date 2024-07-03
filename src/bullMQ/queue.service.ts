import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { QUEUE_BATCH_JOB, QUEUE_VEHICLE_JOB } from './queue.constants';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { Make } from 'src/makes/entities/make.entity';
import * as QueueHelper from './queue.helper';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QUEUE_BATCH_JOB) readonly batchQueue: Queue,
    @InjectQueue(QUEUE_VEHICLE_JOB) readonly vehicleQueue: Queue,
  ) {}

  async addBatchJob() {
    const immediateJobId: string = 'job-process-immediate-batch';
    const isQueueEmpty: boolean = await QueueHelper.isQueueEmpty(
      this.vehicleQueue,
    );

    console.log('Vehicle Queue Empty:', isQueueEmpty);

    if (!isQueueEmpty) {
      console.log('removing all jobs');
      await QueueHelper.removeAllJobs([this.vehicleQueue]);
    }

    console.log('Initiate immediate run');
    await this.batchQueue.add(
      'process-immediate-batch',
      {},
      { jobId: immediateJobId },
    );

    // Schedule Run
    await this.batchQueue.add(
      'process-scheduled-batch',
      {},
      {
        jobId: 'job-process-scheduled-batch',
        repeat: {
          pattern: '0 0 * * *', // Every day at 12:00 AM
        },
      },
    );
  }

  addVehicleTypeJob(vehicleJobPayload: { data: Make }) {
    return this.vehicleQueue.add('process-vehicle', vehicleJobPayload, {
      jobId: `job-process-vehicle:${vehicleJobPayload.data.code}:${uuidv4()}`,
    });
  }
}
