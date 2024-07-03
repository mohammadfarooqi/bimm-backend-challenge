import { Test, TestingModule } from '@nestjs/testing';
import { VehicleTypesApiService } from './vehicle-types-api.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

describe('VehicleTypesApiService', () => {
  let service: VehicleTypesApiService;
  let httpService: HttpService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let configService: ConfigService;
  let mockAxios: MockAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleTypesApiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mocked_endpoint/440'),
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

    service = module.get<VehicleTypesApiService>(VehicleTypesApiService);
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

  it('should fetch vehicle types by make ID and return a formatted response', async () => {
    const xmlResponse = `
      <Response xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
          <Count>2</Count>
          <Message>Response returned successfully</Message>
          <SearchCriteria>Make ID: 440</SearchCriteria>
          <Results>
              <VehicleTypesForMakeIds>
                  <VehicleTypeId>2</VehicleTypeId>
                  <VehicleTypeName>Passenger Car</VehicleTypeName>
              </VehicleTypesForMakeIds>
              <VehicleTypesForMakeIds>
                  <VehicleTypeId>7</VehicleTypeId>
                  <VehicleTypeName>Multipurpose Passenger Vehicle (MPV)</VehicleTypeName>
              </VehicleTypesForMakeIds>
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

    const result = await service.fetchVehicleTypeByMakeId(440);

    expect(result).toEqual({
      vehicleTypes: [
        { code: 2, name: 'Passenger Car' },
        { code: 7, name: 'Multipurpose Passenger Vehicle (MPV)' },
      ],
      count: 2,
    });
  });

  it('should handle errors when fetching vehicle types by make ID', async () => {
    const mockHttpErrorResponse: AxiosResponse = {
      data: '',
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      config: { headers: undefined },
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(mockHttpErrorResponse));

    await expect(service.fetchVehicleTypeByMakeId(440)).rejects.toThrow();
  });
});
