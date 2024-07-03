import { Injectable } from '@nestjs/common';
import { Make, PaginatedMake } from './entities/make.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { MakesApiService } from './makes-api/makes-api.service';
import { QueueService } from 'src/bullMQ/queue.service';

@Injectable()
export class MakesService {
  constructor(
    @InjectRepository(Make) private makesRepository: Repository<Make>,
    private makesAPIService: MakesApiService,
    private queueService: QueueService,
  ) {}

  async getMakes(page: number, pageSize: number): Promise<PaginatedMake> {
    const offset: number = (page - 1) * pageSize;
    const totalItems: number = await this.makesRepository
      .createQueryBuilder('make')
      .getCount();

    const subQuery = this.makesRepository
      .createQueryBuilder('make')
      .select('make.id')
      .orderBy({
        'make.code': 'ASC',
      })
      .offset(offset)
      .limit(pageSize)
      .getQuery();

    const makes: Make[] = await this.makesRepository
      .createQueryBuilder('make')
      .leftJoinAndSelect('make.vehicleTypes', 'vehicleType')
      .where(`make.id IN (${subQuery})`)
      .orderBy({
        'make.code': 'ASC',
        'vehicleType.code': 'ASC',
      })
      .getMany();

    console.log('FETCHED MAKE', totalItems, makes.length);

    return {
      page,
      pageSize,
      totalItems,
      data: makes,
    };
  }

  async processMakes(): Promise<string> {
    const { makes } = await this.makesAPIService.fetchAllMakes();
    const totalItems: number = makes.length;
    console.log('Total Makes Fetched', totalItems);

    for (let i = 0; i < totalItems; i++) {
      const make = this.makesRepository.create(makes[i]);
      await this.queueService.addVehicleTypeJob({
        data: make,
      });
    }
    return `Makes Length: ${makes.length}`;
  }

  upsertMake(make: Make): Promise<InsertResult> {
    return this.makesRepository.upsert(make, ['code']);
  }
}
