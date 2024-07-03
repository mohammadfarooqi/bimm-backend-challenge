import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { VehicleTypesApiService } from './vehicle-types-api/vehicle-types-api.service';
import { VehicleType } from './entities/vehicle-type.entity';
import { Make } from 'src/makes/entities/make.entity';

@Injectable()
export class VehicleTypesService {
  constructor(
    @InjectRepository(VehicleType)
    private vtsRepository: Repository<VehicleType>,
    private vtAPIService: VehicleTypesApiService,
    private dataSource: DataSource,
  ) {}

  async processVehicleTypeByMakeId(makeId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
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

      console.time(`FETCH VEHICLE TYPE ${makeId}`);
      const { vehicleTypes } =
        await this.vtAPIService.fetchVehicleTypeByMakeId(makeId);
      console.timeEnd(`FETCH VEHICLE TYPE ${makeId}`);

      const vtChunks = vehicleTypes;
      // eslint-disable-next-line prettier/prettier
      console.log('Total vehicle types for', makeId, '==', vehicleTypes?.length);

      console.time(`PROCESS DB OP FOR VEHICLE TYPE ${makeId}`);

      const values = vtChunks
        .map((vt) => `('${vt.code}', '${vt.name.replace(/'/g, "''")}')`)
        .join(', ');

      if (values?.length) {
        await queryRunner.query(`
          INSERT INTO vehicle_type (code, name)
          VALUES ${values}
          ON CONFLICT (code) DO UPDATE SET
          name = EXCLUDED.name
        `);
      }

      // go through each vt, find record, and update/attach it to the make
      for (const vt of vtChunks) {
        const _vt = await queryRunner.manager.findOne(VehicleType, {
          where: {
            code: vt.code,
          },
        });

        if (!make.vehicleTypes) {
          make.vehicleTypes = [];
        }

        if (!make.vehicleTypes.some((vt) => vt.id === _vt.id)) {
          make.vehicleTypes.push(_vt);
        }

        await queryRunner.manager.save(make);
      }

      console.timeEnd(`PROCESS DB OP FOR VEHICLE TYPE ${makeId}`);
    } catch (error) {
      console.log('PROCESS VEHICLE TYPE ERROR', error);
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findVehicleTypeByMakeID(makeId: number): Promise<VehicleType[]> {
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
