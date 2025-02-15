import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseStringPromise } from 'xml2js';

@Injectable()
export class VehicleTypesApiService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async fetchVehicleTypeByMakeId(id: number): Promise<{
    vehicleTypes: { code: number; name: string }[];
    count: number;
  }> {
    const response = await this.httpService
      .get(
        this.configService
          .get('endpoints.all_vehicle_types')
          .replace(':makeId', id),
      )
      .toPromise();

    // parse xml to json
    const result = await parseStringPromise(response.data);

    const vts =
      result.Response.Results[0].VehicleTypesForMakeIds?.map((vt) => {
        return {
          code: +vt.VehicleTypeId[0],
          name: vt.VehicleTypeName[0],
        };
      }).sort((a, b) => a.code - b.code) || [];

    const count = +result.Response.Count[0];

    return {
      vehicleTypes: vts,
      count,
    };
  }
}
