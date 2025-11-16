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
export class Attendance extends Model<Attendance> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'employee_id'
    })
    employeeId: string;
    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
        field: 'date'
    })
    Date: Date;
    @Column({
        type: DataType.TIME,
    })
    checkIn: Date;
    @Column({
        type: DataType.TIME,
    })
    checkOut: Date;
}
