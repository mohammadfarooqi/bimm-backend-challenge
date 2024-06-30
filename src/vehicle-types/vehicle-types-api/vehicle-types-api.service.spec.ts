import { Test, TestingModule } from '@nestjs/testing';
import { VehicleTypesApiService } from './vehicle-types-api.service';

describe('VehicleTypesApiService', () => {
  let service: VehicleTypesApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleTypesApiService],
    }).compile();

    service = module.get<VehicleTypesApiService>(VehicleTypesApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
