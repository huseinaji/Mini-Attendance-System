import { ATTENDANCE_REPOSITORY } from "src/constant/constant";
import { Attendance } from "./entities/attendance.entity";

export const attendanceProvider = [
  {
    provide: ATTENDANCE_REPOSITORY,
    useValue: Attendance,
  },
];