import { Test, TestingModule } from '@nestjs/testing';
import { MakesApiService } from './makes-api.service';

describe('MakesApiService', () => {
  let service: MakesApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MakesApiService],
    }).compile();

    service = module.get<MakesApiService>(MakesApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
