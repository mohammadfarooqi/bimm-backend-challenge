import { Injectable } from '@nestjs/common';
import { Make } from './entities/make.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MakesApiService } from './makes-api/makes-api.service';
import { chunk } from 'lodash';
import { VehicleTypesService } from 'src/vehicle-types/vehicle-types.service';

@Injectable()
export class MakesService {
  constructor(
    @InjectRepository(Make) private makesRepository: Repository<Make>,
    private makesAPIService: MakesApiService,
    private dataSource: DataSource,
    private vtsService: VehicleTypesService,
  ) {}

  async findAll(): Promise<Make[]> {
    const { makes } = await this.makesAPIService.fetchAllMakes();
    const makesChunks = chunk(makes, 500);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // insert all makes
    try {
      for (const makesChunk of makesChunks) {
        await queryRunner.startTransaction();

        const values = makesChunk
          .map((make) => `('${make.code}', '${make.name.replace(/'/g, "''")}')`)
          .join(', ');

        await queryRunner.query(`
          INSERT INTO make (code, name)
          VALUES ${values}
          ON CONFLICT (code) DO UPDATE SET
          name = EXCLUDED.name
        `);

        await queryRunner.commitTransaction();
      }
    } catch (error) {
      console.log('error', error);
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }

    // for each make fetch and insert vehicle types
    // for (const _makes of chunk(makes, 20)) {
    //   await Promise.all(
    //     _makes.map((make) => this.vtsService.findByMakeId(make.code)),
    //   );
    // }

    return this.makesRepository
      .createQueryBuilder('make')
      .leftJoinAndSelect('make.vehicleTypes', 'vehicleType')
      .orderBy({
        'make.code': 'ASC',
        'vehicleType.code': 'ASC',
      })
      .getMany();
  }

  create(make: Make): Promise<Make> {
    const newMake = this.makesRepository.create(make);
    return this.makesRepository.save(newMake);
  }
}
