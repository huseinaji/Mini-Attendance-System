package repository

import (
	"database/sql"
	"fmt"
	"mini-attendance/worker/model"
	"time"
)

type AttendanceRepository interface {
	SaveCheckIn(evt model.AttendanceEvent) error
	SaveCheckOut(evt model.AttendanceEvent) error
	GetByEmployeeAndDate(emp string, t time.Time) (*model.AttendanceRecord, error)
}

type attendanceRepo struct {
	db *sql.DB
}

func NewAttendanceRepo(db *sql.DB) AttendanceRepository {
	return &attendanceRepo{db}
}

func (r *attendanceRepo) SaveCheckIn(evt model.AttendanceEvent) error {
	res, err := r.db.Exec(`
		INSERT INTO attendances (employee_id, date, check_in)
		VALUES ($1, $2, $3)
		ON CONFLICT (employee_id, date) DO NOTHING
	`, evt.EmployeeID, evt.Timestamp.Format("2006-01-02"), evt.Timestamp)

	if err != nil {
		return err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("employee already checked in today")
	}

	return nil
}

func (r *attendanceRepo) SaveCheckOut(evt model.AttendanceEvent) error {
	res, err := r.db.Exec(`
		UPDATE attendances
		SET check_out = $1
		WHERE employee_id = $2 AND date = $3 AND check_out IS NULL
	`, evt.Timestamp, evt.EmployeeID, evt.Timestamp.Format("2006-01-02"))

	if err != nil {
		return err
	}

	rowsAffected, err := res.RowsAffected()

	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("employee has already checked out today or not checked in yet")
	}

	return nil
}

func (r *attendanceRepo) GetByEmployeeAndDate(emp string, t time.Time) (*model.AttendanceRecord, error) {
	row := r.db.QueryRow(`
		SELECT employee_id, date, check_in, check_out
		FROM attendances
		WHERE employee_id = $1 AND date = $2
	`, emp, t.Format("2006-01-02"))

	var rec model.AttendanceRecord
	err := row.Scan(&rec.EmployeeID, &rec.Date, &rec.CheckIn, &rec.CheckOut)
	return &rec, err
}
