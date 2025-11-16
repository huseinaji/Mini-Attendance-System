import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject, Request } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { REDIST_CLIENT } from 'src/constant/constant';
import Redis from 'ioredis';

@Controller('api/attendance')
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('checkin')
  checkin(@Request() req) {
    return this.attendanceService.checkin(req.user);
  }

  @UseGuards(AuthGuard)
  @Post('checkout')
  checkout(@Request() req) {
     return this.attendanceService.checkout(req.user);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(+id);
  }
}
