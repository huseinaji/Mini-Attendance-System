import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['employee_id', 'date'], // composite unique
    },
  ],
})
export class AttendanceSummary extends Model<AttendanceSummary> {
  @Column
  employeeId: string;
  @Column({
    type: DataType.DATEONLY
  })
  date: Date
  @Column
  status: string;
}
