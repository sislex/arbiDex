import { Test, TestingModule } from '@nestjs/testing';
import { DexProviderService } from './dex-provider.service';

describe('DexProviderService', () => {
  let service: DexProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DexProviderService],
    }).compile();

    service = module.get<DexProviderService>(DexProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
