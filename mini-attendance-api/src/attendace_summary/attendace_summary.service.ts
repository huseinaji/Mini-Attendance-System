import { Inject, Injectable } from '@nestjs/common';
import { ATTENDANCE_SUM_REPOSITORY } from 'src/constant/constant';
import { AttendanceSummary } from './entities/attendace_summary.entity';

@Injectable()
export class AttendaceSummaryService {
  constructor(@Inject(ATTENDANCE_SUM_REPOSITORY) private attsumModel: typeof AttendanceSummary){}

  async findAll() {
    return this.attsumModel.findAll<AttendanceSummary>();
  }

  async findOne(id: number) {
    return this.attsumModel.findByPk<AttendanceSummary>(id);
  }

  async findQuery(query: any) {
    return this.attsumModel.findAll<AttendanceSummary>({where: {...query}});
  }

  async remove(id: number) {
    return this.attsumModel.destroy({ where: { id } });
  }
}
