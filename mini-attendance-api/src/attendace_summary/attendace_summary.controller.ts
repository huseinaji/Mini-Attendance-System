import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AttendaceSummaryService } from './attendace_summary.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/attendace-summary')
export class AttendaceSummaryController {
  constructor(private readonly attendaceSummaryService: AttendaceSummaryService) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendaceSummaryService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findQuery(@Query() query: any) {
    return this.attendaceSummaryService.findQuery(query);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendaceSummaryService.remove(+id);
  }
}
