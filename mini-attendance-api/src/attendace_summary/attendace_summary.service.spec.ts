import { Test, TestingModule } from '@nestjs/testing';
import { AttendaceSummaryService } from './attendace_summary.service';

describe('AttendaceSummaryService', () => {
  let service: AttendaceSummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendaceSummaryService],
    }).compile();

    service = module.get<AttendaceSummaryService>(AttendaceSummaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
