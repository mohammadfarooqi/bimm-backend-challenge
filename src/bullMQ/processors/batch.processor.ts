import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_BATCH_JOB } from '../queue.constants';
import { MakesService } from 'src/makes/makes.service';
import { Job } from 'bullmq/dist/esm/classes';

@Processor(QUEUE_BATCH_JOB, {
  concurrency: 1,
  name: 'batch-job-p',
})
export class BatchProcessor extends WorkerHost {
  constructor(private makeService: MakesService) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async process(job: Job): Promise<void> {
    console.log('job', job.name);

    try {
      await this.makeService.processMakes();
    } catch (error) {
      console.log('BatchProcessor process error', error);
      throw new Error(error);
    }
  }
}
