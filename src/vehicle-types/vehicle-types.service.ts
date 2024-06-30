import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { VehicleTypesApiService } from './vehicle-types-api/vehicle-types-api.service';
import { VehicleType } from './entities/vehicle-type.entity';
import { chunk } from 'lodash';
import { Make } from 'src/makes/entities/make.entity';

@Injectable()
export class VehicleTypesService {
  constructor(
    @InjectRepository(VehicleType)
    private vtsRepository: Repository<VehicleType>,
    private vtAPIService: VehicleTypesApiService,
    private dataSource: DataSource,
  ) {}

  async findByMakeId(makeId: number): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const make = await queryRunner.manager.findOne(Make, {
      where: {
        code: makeId,
      },
    });
    if (!make) {
      throw new Error(
        `Make with ID ${makeId} not found. You may want to run 'makes' resolver first to fetch all Makes.`,
      );
    }

    const { vehicleTypes } =
      await this.vtAPIService.fetchVehicleTypeByMakeId(makeId);

    const vtChunks = chunk(vehicleTypes, 500);

    try {
      for (const vtChunk of vtChunks) {
        await queryRunner.startTransaction();

        const values = vtChunk
          .map((vt) => `('${vt.code}', '${vt.name.replace(/'/g, "''")}')`)
          .join(', ');

        await queryRunner.query(`
          INSERT INTO vehicle_type (code, name)
          VALUES ${values}
          ON CONFLICT (code) DO UPDATE SET
          name = EXCLUDED.name
        `);

        // go through each vt, find record, and update/attach it to the make
        for (const vt of vtChunk) {
          const _vt = await queryRunner.manager.findOne(VehicleType, {
            where: {
              code: vt.code,
            },
          });

          if (!_vt.makes) {
            _vt.makes = [];
          }

          if (!_vt.makes.find((m) => m.id === make.id)) {
            _vt.makes.push(make);
            await queryRunner.manager.save(_vt);
          }
        }

        await queryRunner.commitTransaction();
      }
    } catch (error) {
      console.log('error', error);
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }

    return this.vtsRepository.find({
      where: {
        makes: {
          code: makeId,
        },
      },
      order: {
        code: 'ASC',
      },
    });
  }
}
