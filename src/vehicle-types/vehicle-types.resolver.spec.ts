import { Test, TestingModule } from '@nestjs/testing';
import { VehicleTypesResolver } from './vehicle-types.resolver';

describe('VehicleTypesResolver', () => {
  let resolver: VehicleTypesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleTypesResolver],
    }).compile();

    resolver = module.get<VehicleTypesResolver>(VehicleTypesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
