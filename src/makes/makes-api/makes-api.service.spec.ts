import { Test, TestingModule } from '@nestjs/testing';
import { MakesApiService } from './makes-api.service';
import { HttpService } from '@nestjs/axios';
import * as MockAdapter from 'axios-mock-adapter';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';

describe('MakesApiService', () => {
  let service: MakesApiService;
  let httpService: HttpService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let configService: ConfigService;
  let mockAxios: MockAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MakesApiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mocked_endpoint'),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MakesApiService>(MakesApiService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    jest.resetAllMocks();
    mockAxios.reset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch all makes and return a formatted response', async () => {
    const xmlResponse = `
      <Response xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <Count>2</Count>
        <Message>Response returned successfully</Message>
        <Results>
          <AllVehicleMakes>
            <Make_ID>440</Make_ID>
            <Make_Name>ASTON MARTIN</Make_Name>
          </AllVehicleMakes>
          <AllVehicleMakes>
            <Make_ID>441</Make_ID>
            <Make_Name>TESLA</Make_Name>
          </AllVehicleMakes>
        </Results>
      </Response>
    `;

    const mockHttpResponse: AxiosResponse = {
      data: xmlResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined,
      },
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(mockHttpResponse));

    const result = await service.fetchAllMakes();

    expect(result).toEqual({
      makes: [
        { code: 440, name: 'ASTON MARTIN' },
        { code: 441, name: 'TESLA' },
      ],
      count: 2,
    });
  });

  it('should handle errors when fetching makes', async () => {
    mockAxios.onGet('mocked_endpoint').reply(500);

    await expect(service.fetchAllMakes()).rejects.toThrow();
  });
});
