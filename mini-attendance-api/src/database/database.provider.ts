import { Sequelize } from 'sequelize-typescript';
import { AttendanceSummary } from 'src/attendace_summary/entities/attendace_summary.entity';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { User } from 'src/user/entities/user.entity';


export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'postgres',
        port: 5432,
        username: 'postgres',
        password: 'root',
        database: 'attendance',
        define: {
          underscored: true,
        },
        logging: console.log,
      });
      sequelize.addModels([User, Attendance, AttendanceSummary]);
      await sequelize.sync({alter: true});
      // await sequelize.query(`
      //   ALTER TABLE attendances
      //   ADD CONSTRAINT attendance_employee_date_unique
      //   UNIQUE (employee_id, date);
      // `);
      // await sequelize.query(`
      //   ALTER TABLE attendance_summaries
      //   ADD CONSTRAINT attendance_summaries_employee_date_unique
      //   UNIQUE (employee_id, date);
      // `);
      return sequelize;
    },
  },
];