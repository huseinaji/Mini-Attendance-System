import { Test, TestingModule } from '@nestjs/testing';
import { AttendaceSummaryController } from './attendace_summary.controller';
import { AttendaceSummaryService } from './attendace_summary.service';

describe('AttendaceSummaryController', () => {
  let controller: AttendaceSummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendaceSummaryController],
      providers: [AttendaceSummaryService],
    }).compile();

    controller = module.get<AttendaceSummaryController>(AttendaceSummaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
