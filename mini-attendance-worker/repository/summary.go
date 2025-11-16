package repository

import (
	"database/sql"
	"mini-attendance/worker/model"
)

type SummaryRepository interface {
	UpsertSummary(evt model.SummaryRecord) error
}

type summaryRepo struct {
	db *sql.DB
}

func NewSummaryRepo(db *sql.DB) SummaryRepository {
	return &summaryRepo{db}
}

func (r *summaryRepo) UpsertSummary(evt model.SummaryRecord) error {
	_, err := r.db.Exec(`
		INSERT INTO attendance_summaries (employee_id, date, status)
		VALUES ($1, $2, $3)
		ON CONFLICT (employee_id, date)
		DO UPDATE SET status = EXCLUDED.status
	`, evt.EmployeeID, evt.Date.Format("2006-01-02"), evt.Status)
	return err
}
