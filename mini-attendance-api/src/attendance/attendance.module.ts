import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { attendanceProvider } from './attendance.provider';
import { UserModule } from 'src/user/user.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [UserModule, RedisModule],
  controllers: [AttendanceController],
  providers: [AttendanceService, ...attendanceProvider],
})
export class AttendanceModule {}
