package model

import "time"

type AttendanceRecord struct {
	EmployeeID string
	Date       time.Time
	CheckIn    time.Time
	CheckOut   time.Time
}

type AttendanceEvent struct {
	EmployeeID string
	Timestamp  time.Time
	Type       string // "checkin" or "checkout"
}

type SummaryRecord struct {
	EmployeeID string
	Date       time.Time
	Status     string // "present", "late", "early_leave"
}
