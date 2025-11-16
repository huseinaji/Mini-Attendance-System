import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceModule } from './attendance/attendance.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { AttendaceSummaryModule } from './attendace_summary/attendace_summary.module';

@Module({
  imports: [AttendanceModule, UserModule, AuthModule, DatabaseModule, RedisModule, AttendaceSummaryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
