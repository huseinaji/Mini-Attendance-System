import { ATTENDANCE_SUM_REPOSITORY } from "src/constant/constant";
import { AttendanceSummary } from "./entities/attendace_summary.entity";

export const attendanceSummaryProvider = [
  {
    provide: ATTENDANCE_SUM_REPOSITORY,
    useValue: AttendanceSummary,
  },
];