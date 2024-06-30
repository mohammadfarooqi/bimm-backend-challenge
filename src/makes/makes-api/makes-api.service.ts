import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { parseStringPromise } from 'xml2js';

@Injectable()
export class MakesApiService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async fetchAllMakes(): Promise<{
    makes: { code: number; name: string }[];
    count: number;
  }> {
    const response = await this.httpService
      .get(this.configService.get('endpoints.all_makes'))
      .toPromise();

    // parse xml to json
    const result = await parseStringPromise(response.data);

    // clean up array of arrays to simplified format
    const makes = result.Response.Results[0].AllVehicleMakes?.map((make) => {
      // if (make.Make_ID.length > 1) console.log('make id', make);
      // if (make.Make_Name.length > 1) console.log('make name', make);

      return {
        code: +make.Make_ID[0],
        name: make.Make_Name[0],
      };
    }).sort((a, b) => a.code - b.code);

    // extract count
    const count = result.Response.Count[0];

    return {
      makes,
      count,
    };
  }
}
