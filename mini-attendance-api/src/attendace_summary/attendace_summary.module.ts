import { Module } from '@nestjs/common';
import { AttendaceSummaryService } from './attendace_summary.service';
import { AttendaceSummaryController } from './attendace_summary.controller';
import { attendanceSummaryProvider } from './attendance_summary.provider';

@Module({
  controllers: [AttendaceSummaryController],
  providers: [AttendaceSummaryService, ...attendanceSummaryProvider],
})
export class AttendaceSummaryModule {}
