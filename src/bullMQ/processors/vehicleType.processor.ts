import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_VEHICLE_JOB } from '../queue.constants';
import { Job } from 'bullmq/dist/esm/classes';
import { VehicleTypesService } from 'src/vehicle-types/vehicle-types.service';
import { MakesService } from 'src/makes/makes.service';

@Processor(QUEUE_VEHICLE_JOB, {
  concurrency: 20,
  name: 'make-job-p',
})
export class VehicleTypeProcessor extends WorkerHost {
  constructor(
    private vtService: VehicleTypesService,
    private makesService: MakesService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    const { data } = job.data;
    console.log('Make:', data.code);
    try {
      // eslint-disable-next-line prettier/prettier
      console.time('TIME TO PROCESS ==>> Make:' + data.code);

      // Create new make
      await this.makesService.upsertMake(data);
      console.log('Make Inserted', data.code);

      // Find vehicle type
      await this.vtService.processVehicleTypeByMakeId(data.code);

      // eslint-disable-next-line prettier/prettier
      console.timeEnd('TIME TO PROCESS ==>> Make:' + data.code);
    } catch (error) {
      console.log('PROCESSOR ERROR ' + data.code, error);
      throw new Error(error);
    }
  }
}
