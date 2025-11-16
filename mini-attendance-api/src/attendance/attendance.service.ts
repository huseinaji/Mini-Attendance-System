import { Inject, Injectable } from '@nestjs/common';
import { ATTENDANCE_REPOSITORY, REDIST_CLIENT, USER_REPOSITORY } from 'src/constant/constant';
import { Attendance } from './entities/attendance.entity';
import Redis from 'ioredis';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @Inject(USER_REPOSITORY) private userModel: typeof User,
    @Inject(ATTENDANCE_REPOSITORY) private attendanceModel: typeof Attendance,
    @Inject(REDIST_CLIENT) private readonly redis: Redis
  ) {}
  
  async findAll() {
    return this.attendanceModel.findAll<Attendance>();
  }

  async findOne(id: number) {
    return this.attendanceModel.findByPk<Attendance>(id);
  }

  async remove(id: number) {
    return this.attendanceModel.destroy({ where: { id } });
  }

  async checkin(payload: any) {
    const id = await this.redis.xadd(
          'attendance_stream',
          '*',
          'timestamp', Date.now().toString(),
          'employee_id', payload.sub,
          'type', 'checkin'
        );
    return id;
  }
  async checkout(payload: any) {
    const id = await this.redis.xadd(
          'attendance_stream',
          '*',
          'timestamp', Date.now().toString(),
          'employee_id', payload.sub,
          'type', 'checkout'
        );
    return id;
  }
}
